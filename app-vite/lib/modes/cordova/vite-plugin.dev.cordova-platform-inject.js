
const { static: serveStatic } = require('express')
const appPaths = require('../../app-paths.js')

const { entryPointMarkup } = require('../../utils/html-template.js')

/**
 * It is applied for dev only!
 */
module.exports.quasarVitePluginDevCordovaPlatformInject = function quasarVitePluginDevCordovaPlatformInject (quasarConf) {
  return {
    name: 'quasar:cordova-platform-inject',
    enforce: 'pre',

    configureServer (server) {
      const folder = appPaths.resolve.cordova(`platforms/${ quasarConf.ctx.targetName }/platform_www`)
      server.middlewares.use('/', serveStatic(folder, { maxAge: 0 }))
    },

    transformIndexHtml: {
      enforce: 'pre',
      transform: html => html.replace(
        entryPointMarkup,
        `<script src="cordova.js"></script>${ entryPointMarkup }`
      )
    }
  }
}
