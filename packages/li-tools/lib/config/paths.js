const path = require('path')
const fs = require('fs')
const { resolve } = require('url')
const chalk = require('chalk')

// 获取app目录
// 拿到app中文件的路径
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

function getPath(cwd) {
  return resolveApp(cwd)
}

function getConfigFile(filename) {
  const resolvePath = resolveApp(filename)
  const exist = fs.existsSync(resolvePath)
  if (fs.existsSync(resolvePath)) {
    return require(resolvePath)
  } else {
    return {}
  }
}

module.exports.getConfigFile = getConfigFile
module.exports.getPath = getPath

module.exports.default = {
  packageJson: resolveApp('package.json'),
  htmlTemplate1: resolveApp('../index.html'),
  htmlTemplate2: resolveApp('src/index.html'),
  appSrc: resolveApp('src'),
  appEntry: resolveApp('src/index.js'),
  webpackConfig: resolveApp('webpack.config.js'),
  alpharc: resolveApp('.alpharc'),
  mockConfig: resolveApp('.mock.config.js'),
  dist: resolveApp('dist'),
  dllPath: resolveApp('static/js'),
  dllMainfest: resolveApp('static/vendor-mainfest.json'),
  yarnLockFile: resolveApp('yarn.lock'),
}