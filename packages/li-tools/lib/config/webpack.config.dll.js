const path = require('path')
const webpack = require('webpack')
const ProgressPlugin = require('progress-bar-webpack-plugin')
const paths = require('./paths').default

module.exports = {
  entry: {
    vendor: [
      'classnames',
      'babel-polyfill',
      'react',
      'react-dom',
      'react-router',
      'react-router-dom',
      'redux-actions',
      'rc-queue-anim',
      'rc-select',
      'moment',
    ]
  },
  mode: 'development',
  devtool: 'source-map',
  output: {
    path: paths.dllPath,
    filename: '[name].dll.js',
    library: '[name]_library',
  },

  plugins: [
    new webpack.DllPlugin({
      path: paths.dllMainfest,
      name: '[name]_library',
    }),
    new ProgressPlugin(),
  ]
}