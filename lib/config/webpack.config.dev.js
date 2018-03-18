/**
 * @flow
 */

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const eslintFormatter = require('react-dev-utils/eslintFormatter')
const htmltemplatePlugin = require('./getHtmlTemplate')
const { getConfigFile, getPath } = require('./paths')
const paths = require('./paths').default
const getBabelConfig = require('./getBabelConfig')

const argv = require('yargs')
.option('eslint',{
  type: 'boolean',
  describe:'',
  default:true,
})
.argv

const packageJson = getConfigFile(paths.packageJson)
const appWebpackConfig = getConfigFile(paths.webpackConfig)
const ROUTE_PATH = ''
const theme = packageJson.antdTheme || {}

/** windows require.resolve 返回大写盘符 */
const resolve = require.resolve
let config = {
  // context: getPath(''),
  entry:{
    app: [resolve('react-dev-utils/webpackHotDevClient'), paths.appEntry],
    vendor: ['babel-polyfill', 'react']
  },
  output: {
    path: getPath(`dist${ROUTE_PATH}`),
    pathinfo: true,
    publicPath: `${ROUTE_PATH}/`,
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
    library: 'bundleJs',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),

  },
  resolve:{},
  devtool :'source-map',
  plugins:[
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor','runtime'],
      filename: '[name].[hash].js'
    }),
    htmltemplatePlugin,
    // new ExtractTextPlugin('[name].css'),
    new webpack.ProgressPlugin(),
    new webpack.DefinePlugin({
      ROUTE_PREFIX: JSON.stringify(ROUTE_PATH),
      __DEV__:JSON.stringify(true),
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    })
  ],
  module: {
    rules: [{
      test: /\.(js|jsx|mjs)$/,
      enforce: 'pre',
      use: [
        {
          options: {
            formatter: eslintFormatter,
            eslintPath: resolve('eslint'),
            parser:'babel-eslint'
            // @remove-on-eject-begin
            // ignore: false,
            // useEslintrc: false,
            // @remove-on-eject-end
          },
          loader: resolve('eslint-loader'),
        },
      ],
      include: paths.appSrc,
    },
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: [
        // resolve('react-hot-loader/webpack'), 
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
      use: [
        resolve("style-loader"),
        resolve("css-loader"),
        `${resolve('less-loader')}?{"sourceMap":true,"modifyVars":${JSON.stringify(theme)}}`,
      ]
    }, {
      test: /\.woff|\.woff2|.eot|\.svg|\.ttf/,
      use: `${resolve('url-loader')}?prefix=font/&limit=10000&[name]-[hash].[ext]`
    }, {
      test: /\.png/,
      use: `${resolve('url-loader')}?limit=10000!./file.png`
    }]
  }
}
if(!argv.eslint){
  config.module.rules.splice(0,1)
}
config = merge(config,appWebpackConfig)

module.exports = config