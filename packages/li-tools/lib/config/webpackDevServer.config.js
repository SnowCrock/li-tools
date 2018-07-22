const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware')
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware')
const paths = require('./paths').default

const webpackDevServerConfig = {
  // 一切服务都启用gzip 压缩
  compress: true,
  hot: true,
  host: process.env.HTTPS === true ? 'https' : 'http',
  publicPath: '',
  // filename: "bundle.min.js",
  contentBase: paths.appSrc,
  // 启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见。
  quiet: true,
  // 当使用内联模式(inline mode)时，在开发工具(DevTools)的控制台(console)将显示消息，
  // 如：在重新加载之前，在一个错误之前，或者模块热替换(Hot Module Replacement)启用时。这可能显得很繁琐。
  // 你可以阻止所有这些消息显示，使用这个选项：
  historyApiFallback: {
    // 当路径中使用点(dot)（常见于 Angular），你可能需要使用 disableDotRule：
    disableDotRule: true
  },
  clientLogLevel: 'none',
  // Shows a full-screen overlay in the browser when there are compiler errors or warnings. Disabled by default. If you want to show only compiler errors:
  overlay: false,
  // 与监视文件相关的控制选项
  watchOptions: {
    ignored: /node_modules/
  },
  //禁用host检查??
  disableHostCheck: true,
  // Tell the server to watch the files served by the devServer.contentBase option. File changes will trigger a full page reload.
  watchContentBase: true,

  // disabled deprecated. The `setup` option is deprecated and will be removed in v3. Please update your config to use `before`
  // Here you can access the Express app object and add your own custom middleware to it. For example, to define custom handlers for some paths:
  // setup(app:any) {
  //   // This lets us open files from the runtime error overlay.
  //   app.use(errorOverlayMiddleware());
  //   // This service worker file is effectively a 'no-op' that will reset any
  //   // previous service worker registered for the same host:port combination.
  //   // We do this in development to avoid hitting the production cache if
  //   // it used the same host and port.
  //   // https://github.com/facebookincubator/create-react-app/issues/2272#issuecomment-302832432
  //   app.use(noopServiceWorkerMiddleware());
  // },

  //Provides the ability to execute custom middleware prior to all other middleware internally within the server. 
  // This could be used to define custom handlers, for example
  before(app) {
    // This lets us open files from the runtime error overlay.
    app.use(errorOverlayMiddleware());
    // This service worker file is effectively a 'no-op' that will reset any
    // previous service worker registered for the same host:port combination.
    // We do this in development to avoid hitting the production cache if
    // it used the same host and port.
    // https://github.com/facebookincubator/create-react-app/issues/2272#issuecomment-302832432
    app.use(noopServiceWorkerMiddleware());
  },
  // Provides the ability to execute custom middleware after all other middleware internally within the server.
  after(app) {
    // do fancy stuff
  }
}

module.exports = webpackDevServerConfig