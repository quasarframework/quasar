
import { readFileSync } from 'node:fs'

import { progress } from '../../utils/logger.js'

const workboxMethodMap = {
  GenerateSW: 'generateSW',
  InjectManifest: 'injectManifest'
}

export function createHeadTags (quasarConf) {
  const { publicPath } = quasarConf.build
  const { pwaManifest } = quasarConf.htmlVariables
  const { useCredentialsForManifestTag, injectPwaMetaTags, manifestFilename } = quasarConf.pwa

  let headTags
    = `<link rel="manifest" href="${ publicPath }${ manifestFilename }"${ useCredentialsForManifestTag === true ? ' crossorigin="use-credentials"' : '' }>`

  if (injectPwaMetaTags === true) {
    headTags
      += (pwaManifest.theme_color !== void 0
        ? `<meta name="theme-color" content="${ pwaManifest.theme_color }">`
          + `<link rel="mask-icon" href="${ publicPath }icons/safari-pinned-tab.svg" color="${ pwaManifest.theme_color }">`
        : '')
      + '<meta name="apple-mobile-web-app-capable" content="yes">'
      + '<meta name="apple-mobile-web-app-status-bar-style" content="default">'
      + (pwaManifest.name !== void 0 ? `<meta name="apple-mobile-web-app-title" content="${ pwaManifest.name }">` : '')
      + `<meta name="msapplication-TileImage" content="${ publicPath }icons/ms-icon-144x144.png">`
      + '<meta name="msapplication-TileColor" content="#000000">'
      + `<link rel="apple-touch-icon" href="${ publicPath }icons/apple-icon-120x120.png">`
      + `<link rel="apple-touch-icon" sizes="152x152" href="${ publicPath }icons/apple-icon-152x152.png">`
      + `<link rel="apple-touch-icon" sizes="167x167" href="${ publicPath }icons/apple-icon-167x167.png">`
      + `<link rel="apple-touch-icon" sizes="180x180" href="${ publicPath }icons/apple-icon-180x180.png">`
  }
  else if (typeof injectPwaMetaTags === 'function') {
    headTags += injectPwaMetaTags({ publicPath, pwaManifest })
  }

  return headTags
}

export function injectPwaManifest (quasarConf, ifNotAlreadyGenerated) {
  if (ifNotAlreadyGenerated === true && quasarConf.htmlVariables.pwaManifest !== void 0) {
    return
  }

  const { appPkg } = quasarConf.ctx.pkg

  const id = appPkg.name || 'quasar-pwa'
  const pwaManifest = {
    id,
    name: appPkg.productName || appPkg.name || 'Quasar App',
    short_name: id,
    description: appPkg.description,
    display: 'standalone',
    start_url: quasarConf.build.publicPath,
    ...JSON.parse(readFileSync(quasarConf.metaConf.pwaManifestFile, 'utf-8'))
  }

  if (typeof quasarConf.pwa.extendManifestJson === 'function') {
    quasarConf.pwa.extendManifestJson(pwaManifest)
  }

  quasarConf.htmlVariables.pwaManifest = pwaManifest
}

export async function buildPwaServiceWorker (quasarConf, workboxConfig) {
  const { ctx: { cacheProxy }, pwa: { workboxMode } } = quasarConf

  const done = progress('Compiling of the ___ with Workbox in progress...', 'Service Worker')

  const buildMethod = workboxMethodMap[ workboxMode ]
  const workboxBuild = await cacheProxy.getModule('workboxBuild')

  await workboxBuild[ buildMethod ](workboxConfig)

  done('The ___ compiled with success')
}
