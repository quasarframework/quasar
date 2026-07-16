import { dirname } from 'node:path'
import fse from 'fs-extra'
import serveStatic from 'serve-static'
import { merge } from 'webpack-merge'

import { progress } from '../../utils/logger.js'

let headTags = ''

function updateHeadTags(quasarConf, pwaManifest) {
  const { publicPath } = quasarConf.build
  const { useCredentialsForManifestTag, injectPWAMetaTags, manifestFilename } =
    quasarConf.pwa

  headTags = `<link rel="manifest" href="${publicPath}${manifestFilename}"${useCredentialsForManifestTag ? ' crossorigin="use-credentials"' : ''}>`

  if (typeof injectPWAMetaTags === 'function') {
    headTags += injectPWAMetaTags({
      publicPath,
      pwaManifest
    })
  } else if (injectPWAMetaTags) {
    headTags +=
      (pwaManifest.theme_color !== void 0
        ? `<meta name="theme-color" content="${pwaManifest.theme_color}">` +
          `<link rel="mask-icon" href="${publicPath}icons/safari-pinned-tab.svg" color="${pwaManifest.theme_color}">`
        : '') +
      '<meta name="mobile-web-app-capable" content="yes">' +
      '<meta name="apple-mobile-web-app-status-bar-style" content="default">' +
      (pwaManifest.name !== void 0
        ? `<meta name="apple-mobile-web-app-title" content="${pwaManifest.name}">`
        : '') +
      `<meta name="msapplication-TileImage" content="${publicPath}icons/ms-icon-144x144.png">` +
      '<meta name="msapplication-TileColor" content="#000000">' +
      `<link rel="apple-touch-icon" href="${publicPath}icons/apple-icon-120x120.png">` +
      `<link rel="apple-touch-icon" sizes="152x152" href="${publicPath}icons/apple-icon-152x152.png">` +
      `<link rel="apple-touch-icon" sizes="167x167" href="${publicPath}icons/apple-icon-167x167.png">` +
      `<link rel="apple-touch-icon" sizes="180x180" href="${publicPath}icons/apple-icon-180x180.png">`
  }
}

export async function injectPwaManifest(quasarConf, outputManifestPath) {
  const { appPkg } = quasarConf.ctx.pkg

  const id = appPkg.name || 'quasar-pwa'
  let pwaManifest = {
    id,
    name: appPkg.productName || appPkg.name || 'Quasar App',
    short_name: id,
    description: appPkg.description,
    display_override: ['fullscreen', 'minimal-ui'],
    display: 'standalone',
    start_url: quasarConf.build.publicPath,
    ...JSON.parse(fse.readFileSync(quasarConf.metaConf.pwaManifestFile, 'utf8'))
  }

  if (typeof quasarConf.pwa.extendPWAManifestJson === 'function') {
    const overrides = await quasarConf.pwa.extendPWAManifestJson(pwaManifest)
    if (Object(overrides) === overrides) {
      pwaManifest = merge({}, pwaManifest, overrides)
    }
  }

  await quasarConf.ctx.appExt.runAppExtensionHook(
    'extendPWAManifestJson',
    async hook => {
      hook.api.logger.log(`Running "extendPWAManifestJson(pwaManifest)"`)
      const overrides = await hook.fn(pwaManifest, hook.api)
      if (Object(overrides) === overrides) {
        pwaManifest = merge({}, pwaManifest, overrides)
      }
    }
  )

  quasarConf.htmlVariables.pwaManifest = pwaManifest

  updateHeadTags(quasarConf, pwaManifest)

  fse.ensureDirSync(dirname(outputManifestPath))
  fse.writeFileSync(
    outputManifestPath,
    JSON.stringify(
      pwaManifest,
      null,
      quasarConf.build.minify !== false ? void 0 : 2
    ),
    'utf8'
  )
}

export function quasarVitePluginPwaResources(quasarConf) {
  return {
    name: 'quasar:pwa-resources',
    enforce: 'pre',

    transformIndexHtml: {
      handler: html =>
        html.replace(/(<\/head>)/i, (_, tag) => `${headTags}${tag}`)
    },

    // runs for dev only to serve manifest and service-worker
    configureServer(server) {
      server.middlewares.use(
        quasarConf.build.publicPath,
        serveStatic(quasarConf.ctx.appPaths.resolve.entry('service-worker'), {
          maxAge: 0
        })
      )
    }
  }
}

const workboxMethodMap = {
  GenerateSW: 'generateSW',
  InjectManifest: 'injectManifest'
}

export async function buildPwaServiceWorker(quasarConf, workboxConfig) {
  const {
    ctx: { cacheProxy },
    pwa: { workboxMode }
  } = quasarConf

  const done = progress({
    tool: 'Workbox',
    waitAction: 'Compiling',
    doneAction: 'Compiled',
    target: 'Service Worker'
  })

  const buildMethod = workboxMethodMap[workboxMode]
  const workboxBuild = await cacheProxy.getModule('workboxBuild')

  await workboxBuild[buildMethod](workboxConfig)
  done()
}
