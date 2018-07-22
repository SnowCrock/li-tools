const fs = require('fs-extra')
const webpack = require('webpack')
const chalk = require('chalk')
const paths = require('../config/paths').default

class DLLAutoCreatePlugin {
  constructor() {
    this.hasCompile = false
  }

  checkdll() {
    if (this.hasCompile) return
    this.hasCompile = true
    if (!fs.existsSync(paths.dllMainfest)) this.hasCompile = false
  }

  async createDllCompiler(compilation, cb) {
    if (this.hasCompile) {
      cb()
      return
    }
    this.hasCompile = true
    const webpackConfig = require('../config/webpack.config.dll')
    await new Promise((resolve, reject) => {
      const dllCompiler = webpack(webpackConfig, (err, stats) => {
        resolve()
      })
    })
    cb()
  }

  apply(compiler) {
    this.checkdll()
    if (this.hasCompile) return
    process.stderr.write(chalk.yellow(`DLL not exits, it's will run to build dll \n`))
    compiler.hooks.beforeCompile.tapAsync(
      'DLLAutoCreatePlugin',
      this.createDllCompiler.bind(this),
    )
  }
}

module.exports = DLLAutoCreatePlugin