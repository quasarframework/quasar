
const webpackNames = {
  spa: {
    renderer: 'UI'
  },

  pwa: {
    renderer: 'UI',
    csw: 'Custom Service Worker'
  },

  ssr: {
    serverSide: 'Server-side',
    clientSide: 'Client-side',
    webserver: 'Webserver'
  },

  cordova: {
    renderer: 'UI'
  },

  capacitor: {
    renderer: 'UI'
  },

  electron: {
    renderer: 'Renderer',
    preload: 'Preload',
    main: 'Main'
  },

  bex: {
    renderer: 'Renderer',
    main: 'Main'
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
