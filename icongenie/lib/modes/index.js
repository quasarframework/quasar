
module.exports = {
  spa: {
    folder: '/src',
    assets: require('./spa')
  },

  pwa: {
    folder: '/src-pwa',
    assets: require('./pwa')
  },

  ssr: {
    folder: '/src-ssr',
    assets: require('./ssr')
  },

  bex: {
    folder: '/src-bex',
    assets: require('./bex')
  },

  cordova: {
    folder: '/src-cordova',
    assets: require('./cordova')
  },

  capacitor: {
    folder: '/src-capacitor',
    assets: require('./capacitor')
  },

  electron: {
    folder: '/src-electron',
    assets: require('./electron')
  }
}
