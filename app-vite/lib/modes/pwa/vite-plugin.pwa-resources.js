
import { static as serveStatic } from 'express'

import appPaths from '../../app-paths.js'
import { createHeadTags } from './utils.js'

export function quasarVitePluginPwaResources (quasarConf) {
  let pwaManifest = null
  let headTags
  let manifestContent

  function updateCache () {
    if (quasarConf.htmlVariables.pwaManifest === pwaManifest) {
      return
    }

    pwaManifest = quasarConf.htmlVariables.pwaManifest
    headTags = createHeadTags(quasarConf)
    manifestContent = JSON.stringify(pwaManifest)
  }

  return {
    name: 'quasar:pwa-resources',
    enforce: 'pre',

    transformIndexHtml: {
      transform: html => {
        updateCache()
        return html.replace(
          /(<\/head>)/i,
          (_, tag) => `${ headTags }${ tag }`
        )
      }
    },

    // runs for dev only to serve manifest and service-worker
    configureServer (server) {
      server.middlewares.use(
        `${ quasarConf.build.publicPath }${ quasarConf.pwa.manifestFilename }`,
        (_, res) => {
          updateCache()
          res.setHeader('Content-Type', 'application/json')
          res.end(manifestContent)
        }
      )

      server.middlewares.use(
        quasarConf.build.publicPath,
        serveStatic(appPaths.resolve.app('.quasar/pwa'), { maxAge: 0 })
      )
    }
  }
}
