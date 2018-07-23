/**
 * @flow
 */

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const autoprefixer = require('autoprefixer')
const ProgressPlugin = require('progress-bar-webpack-plugin')
const eslintFormatter = require('react-dev-utils/eslintFormatter')
const DLLAutoCreatePlugin = require('../plugins/DLLAutoCreatePlugin')
const HtmltemplatePlugin = require('./getHtmlTemplate')
const { getConfigFile, getPath } = require('./paths')
const paths = require('./paths').default
const getBabelConfig = require('./getBabelConfig')

const argv = require('yargs')
  .option('eslint', {
    type: 'boolean',
    describe: '',
    default: true,
  })
  .argv

const packageJson = getConfigFile(paths.packageJson)
const appWebpackConfig = getConfigFile(paths.webpackConfig)
const ROUTE_PATH = ''
const theme = packageJson.theme || {}

/** windows require.resolve 返回大写盘符 */
const resolve = require.resolve
let config = {
  entry: {
    app: [resolve('react-dev-utils/webpackHotDevClient'), paths.appEntry],
    // vendor: ['babel-polyfill', 'react']
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
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', 'jsx', '.json']
  },
  devtool: 'source-map',
  mode: 'development',
  plugins: [
    HtmltemplatePlugin,
    // new ExtractTextPlugin('[name].css'),
    new ProgressPlugin(),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(true),
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new DLLAutoCreatePlugin(),
    new webpack.DllReferencePlugin({
      manifest: paths.dllMainfest,
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
            parser: 'babel-eslint'
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
          loader: resolve('babel-loader'),
          options: {
            ...getBabelConfig(),
            cacheDirectory: true,
          }
        }
      ]
    }, {
      test: /\.(less|css)$/,
      use: [
        resolve("style-loader"),
        resolve("css-loader"),
        {
          loader: resolve('postcss-loader'),
          options: {
            plugins: [
              // TODO: 仍然使用webpack3 的plugin
              autoprefixer({
                browsers: [
                  '>1%',
                  'last 4 versions',
                  'Firefox ESR',
                  'not ie < 9', // React doesn't support IE8 anyway
                ],
                flexbox: 'no-2009',
              }),
            ],
          }
        },
        {
          loader: resolve('less-loader'),
          options: {
            modifyVars: theme,
          },
        }
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
if (!argv.eslint) {
  config.module.rules.splice(0, 1)
}
config = merge(config, appWebpackConfig)

module.exports = config