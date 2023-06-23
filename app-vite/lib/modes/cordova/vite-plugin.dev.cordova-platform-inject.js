
import { static as serveStatic } from 'express'
import appPaths from '../../app-paths.js'

import { entryPointMarkup } from '../../utils/html-template.js'

/**
 * It is applied for dev only!
 */
export function quasarVitePluginDevCordovaPlatformInject (quasarConf) {
  return {
    name: 'quasar:cordova-platform-inject',
    enforce: 'pre',

    configureServer (server) {
      const folder = appPaths.resolve.cordova(`platforms/${ quasarConf.ctx.targetName }/platform_www`)
      server.middlewares.use('/', serveStatic(folder, { maxAge: 0 }))
    },

    transformIndexHtml: {
      order: 'pre',
      transform: html => html.replace(
        entryPointMarkup,
        `<script src="cordova.js"></script>${ entryPointMarkup }`
      )
    }
  }
}
