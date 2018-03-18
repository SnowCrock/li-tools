/**
 * @flow
 */

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const paths, { getFile, getPath } = require('../utils/paths')
const { isFun } = require('../utils/util')
const { getBabelConfig } = require('./getConfig')

process.env.NODE_ENV = 'production'

const argv = require('yargs')
.option('debug',{
  type: 'boolean',
  describe: '',
  default: false,
})
.option('compress', {
  type: 'boolean',
  describe: '',
  default: false,
})
.argv

const packageJson = getFile(paths.packageJson)
const appWebpackConfig = getFile(paths.webpackConfig)
let { title='alpha', icon, prodRouter:ROUTE_PATH } = packageJson.config || {}
const theme = packageJson.antdTheme
/** windows require.resolve 返回大写盘符 */
const resolve = require.resolve
let config = {
  // context: getPath(''),
  entry:{
    app: [getPath('src/index')],
    vendor: ['babel-polyfill', 'react','react-dom', 'moment', 'redux']
  },
  output: {
    path: getPath(`dist`),
    pathinfo: true,
    publicPath: `${ROUTE_PATH}/`,
    filename: '[name].[hash].js',
    library: 'bundleJs',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path
        .relative(paths.appSrc, info.absoluteResourcePath)
        .replace(/\\/g, '/'),
  },
  resolve:{},
  devtool : argv.debug? 'source-map':'cheap-module-source-map',
  plugins:[
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor','runtime'],
      filename: '[name].[hash].js'
    }),
    new HtmlWebpackPlugin({
      title: title,
      favicon: getPath(`src/${icon}`),
      template: getPath(`src/index.html`)
    }),
    new ExtractTextPlugin({ filename:'[name].css',  allChunks: true }),
    new webpack.ProgressPlugin(),
    new webpack.DefinePlugin({
      ROUTE_PREFIX: JSON.stringify(ROUTE_PATH),
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        // Disabled because of an issue with Uglify breaking seemingly valid code:
        // https://github.com/facebookincubator/create-react-app/issues/2376
        // Pending further investigation:
        // https://github.com/mishoo/UglifyJS2/issues/2011
        comparisons: false,
      },
      mangle: {
        safari10: true,
      },        
      output: {
        comments: false,
        // Turned on because emoji and regex is not minified properly using default
        // https://github.com/facebookincubator/create-react-app/issues/2488
        ascii_only: true,
      },
      sourceMap: argv.debug,
    }),
  ],
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: [
        resolve('react-hot-loader/webpack'), 
        {
          loader:resolve('babel-loader'),
          options:{
            ...getBabelConfig(),
            cacheDirectory:true,
          }
        }
      ]
    },{
      test: /\.css$/,
      use: [resolve("style-loader"), resolve("css-loader")]
    }, {
      test: /\.less$/,
      use: ExtractTextPlugin.extract({
        fallback: resolve("style-loader"),
        use:[
          resolve("css-loader"),
          `${resolve('less-loader')}?{"sourceMap":true,"modifyVars":${JSON.stringify(theme)}}`,
        ]
      }),
    },{
      test: /\.woff|\.woff2|.eot|\.svg|\.ttf/,
      use: `${resolve('url-loader')}?prefix=font/&limit=10000&[name]-[hash].[ext]`
    }, {
      test: /\.png/,
      use: `${resolve('url-loader')}?limit=10000!./file.png`
    }]
  }
}
if (argv.compress) {
  config.plugins.push(new CompressionPlugin())
}
config = merge(config,appWebpackConfig)

export default config