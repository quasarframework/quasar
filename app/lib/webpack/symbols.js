
const webpackNames = {
  spa: {
    renderer: 'User Interface'
  },

  pwa: {
    renderer: 'User Interface',
    csw: 'Custom Service Worker'
  },

  ssr: {
    serverSide: 'Server-side',
    clientSide: 'Client-side',
    webserver: 'Webserver'
  },

  cordova: {
    renderer: 'User Interface'
  },

  capacitor: {
    renderer: 'User Interface'
  },

  electron: {
    renderer: 'Renderer process',
    preload: 'Preload process',
    main: 'Main process'
  },

  bex: {
    renderer: 'Renderer process',
    main: 'Main process'
  }
}

function splitWebpackConfig (webpackConfigs, mode) {
  return Object.keys(webpackNames[ mode ])
    .filter(name => webpackConfigs[ name ] !== void 0)
    .map(name => ({
      name: webpackNames[ mode ][ name ],
      webpack: webpackConfigs[ name ]
    }))
}

module.exports.webpackNames = webpackNames
module.exports.splitWebpackConfig = splitWebpackConfig
