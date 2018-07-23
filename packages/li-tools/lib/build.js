const webpack = require('webpack')
const webpackConfig = require('./config/webpack.config.prod')

const compiler = webpack(webpackConfig)

compiler.run((err, stats) => {
  if(err) {
    console.log(err)
    process.exit(1)
  }

  // https://webpack.docschina.org/configuration/stats/#stats 
    // 具体参数配置可在这找
    console.log(stats.toString({
      chunks: false,  // 使构建过程更静默无输出
      colors: true,    // 在控制台展示颜色
      cached: false,
      cachedAssets: false,
      chunkOrigins: false,
      chunkModules: false,
      modules: false,
      entrypoints: false,
      children: false, // 添加 children 信息
      source: false,
      excludeModules: /\.map/,
      timings: true,
    }))
})
