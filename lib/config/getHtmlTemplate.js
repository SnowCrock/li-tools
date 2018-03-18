const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { getConfigFile, getPath } = require('./paths')
const paths = require('./paths').default

const appWebpackConfig = getConfigFile(paths.webpackConfig)
const { icon = '', title ='' } = appWebpackConfig.config || {}
const htmlTemplate = []
Object.keys(paths).forEach(fileName => {
  if (fileName.match(/template/i) && fs.existsSync(paths[fileName])) {
    htmlTemplate.push(paths[fileName])
  }
})
module.exports = new HtmlWebpackPlugin({
  title: title || '',
  favicon: icon ? getPath(`src/${icon}`) : '' ,
  template: htmlTemplate[0] ? htmlTemplate[0] : require.resolve('../template/index.html')
})
