import { static as serveStatic } from 'express'

import { entryPointMarkup } from '../../utils/html-template.js'

/**
 * It is applied for dev only!
 */
export function quasarVitePluginDevCordovaPlatformInject (quasarConf) {
  const folder = quasarConf.ctx.appPaths.resolve.cordova(
    `platforms/${ quasarConf.ctx.targetName }/platform_www`
  )

  return {
    name: 'quasar:cordova-platform-inject',
    enforce: 'pre',

    configureServer (server) {
      server.middlewares.use('/', serveStatic(folder, { maxAge: 0 }))
    },

    transformIndexHtml: {
      order: 'pre',
      handler: html => html.replace(
        entryPointMarkup,
        `<script src="cordova.js"></script>${ entryPointMarkup }`
      )
    }
  }
}
