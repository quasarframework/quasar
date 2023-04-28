
import spaAssets from './spa.js'
import pwaAssets from './pwa.js'
import ssrAssets from './ssr.js'
import bexAssets from './bex.js'
import cordovaAssets from './cordova.js'
import capacitorAssets from './capacitor.js'
import electronAssets from './electron.js'

export const modes = {
  spa: {
    folder: '/src',
    assets: spaAssets
  },

  pwa: {
    folder: '/src-pwa',
    assets: pwaAssets
  },

  ssr: {
    folder: '/src-ssr',
    assets: ssrAssets
  },

  bex: {
    folder: '/src-bex',
    assets: bexAssets
  },

  cordova: {
    folder: '/src-cordova',
    assets: cordovaAssets
  },

  capacitor: {
    folder: '/src-capacitor',
    assets: capacitorAssets
  },

  electron: {
    folder: '/src-electron',
    assets: electronAssets
  }
}
