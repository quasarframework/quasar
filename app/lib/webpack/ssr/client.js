const injectClientSpecifics = require('../inject.client-specifics')
const injectHotUpdate = require('../inject.hot-update')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

module.exports = function (chain, cfg) {
  injectClientSpecifics(chain, cfg)
  injectHotUpdate(chain, cfg)

  chain.plugin('vue-ssr-client')
    .use(VueSSRClientPlugin, [{
      filename: '../vue-ssr-client-manifest.json'
    }])
}
