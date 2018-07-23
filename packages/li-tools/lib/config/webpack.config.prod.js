/**
 * @flow
 */

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const CompressionPlugin = require('compression-webpack-plugin')
const ProgressPlugin = require('progress-bar-webpack-plugin')
const HtmltemplatePlugin = require('./getHtmlTemplate')
const { getConfigFile, getPath } = require('./paths')
const getBabelConfig = require('./getBabelConfig')

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

const packageJson = getConfigFile(paths.packageJson)
const appWebpackConfig = getConfigFile(paths.webpackConfig)
const theme = packageJson.theme || {}
/** windows require.resolve 返回大写盘符 */
const resolve = require.resolve
let config = {
  // context: getPath(''),
  entry:{
    app: [paths.appEntry],
    // vendor: ['babel-polyfill', 'react']
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
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', 'jsx', '.json']
  },
  devtool: argv.debug ? 'source-map' : 'cheap-module-source-map',
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor','runtime'],
      filename: '[name].[hash].js'
    }),
    HtmltemplatePlugin,
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new ProgressPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new DLLAutoCreatePlugin(),
    new webpack.DllReferencePlugin({
      manifest: paths.dllMainfest,
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

module.exports = config