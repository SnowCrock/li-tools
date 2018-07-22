const webpack = require('webpack')
const webpackConfig = require('./config/webpack.config.prod')

const compiler = webpack(webpackConfig)

compiler.run(() => {
  
})
