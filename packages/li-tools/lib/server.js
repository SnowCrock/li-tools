const fs = require('fs')
const chalk = require('chalk')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const {
  choosePort,
  prepareUrls,
  createCompiler,
} = require('react-dev-utils/WebpackDevServerUtils')
const clearConsole = require('react-dev-utils/clearConsole')
const openBrowser = require('react-dev-utils/openBrowser')
const paths = require('./config/paths').default

const packageJson = require(paths.packageJson)
const webpackDevServerConfig = require('./config/webpackDevServer.config')
const webpackConfig = require('./config/webpack.config.dev')

const useYarn = fs.existsSync(paths.yarnLockFile)
const isInteractive = process.env.isInteractive
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
const hostname = process.env.HOST || '0.0.0.0'
const defaultPort = 8001
const appName = packageJson.name

choosePort(hostname, defaultPort)
  .then(port => {
    if (port === null) {
      // We have not found a port.
      return
    }
    // 转换成各个地方使用的url集合,控制台，浏览器等使用
    const urls = prepareUrls(protocol, hostname, port)
    const compiler = createCompiler(webpack, webpackConfig, appName, urls, useYarn)
    const devServer = new WebpackDevServer(compiler, webpackDevServerConfig);
    // Launch WebpackDevServer.
    devServer.listen(port, hostname, err => {
      if (err) {
        return console.log(err)
      }
      if (isInteractive) {
        clearConsole()
      }
      console.log(chalk.cyan('Starting the development server...\n'));
      openBrowser(urls.localUrlForBrowser)
    })

    // windows下可能存在端口号不关闭的情况
    // 这里进行变量声明是防止分号';' 造成的语法错误
    const killSemicolon = ['SIGINT', 'SIGTERM'].forEach(function (sig) {
      process.on(sig, function () {
        devServer.close()
        process.exit()
      })
    })
  })
  .catch(err => {
    if (err && err.message) {
      console.log(err.message)
    }
    process.exit(1)
  });