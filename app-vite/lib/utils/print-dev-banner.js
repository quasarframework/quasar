const { green, dim } = require('kolorist')
const { join } = require('node:path')

const appPaths = require('../app-paths.js')
const { quasarPkg, cliPkg } = require('../app-pkg.js')
const { getCompilationTarget } = require('../utils/banner-global.js')

const greenBanner = green('»')
const line = dim('   ———————————————————————')
const cache = {}

function getIPList () {
  // expensive operation, so cache the response
  if (cache.ipList === void 0) {
    const { getIPs } = require('../utils/net.js')
    cache.ipList = getIPs().map(ip => (ip === '127.0.0.1' ? 'localhost' : ip))
  }

  return cache.ipList
}

function getBanner (quasarConf) {
  const { ctx } = quasarConf
  const banner = [
    ` ${ greenBanner } Reported at............ ${ dim(new Date().toLocaleDateString()) } ${ dim(new Date().toLocaleTimeString()) }`,
    ` ${ greenBanner } App dir................ ${ green(appPaths.appDir) }`
  ]

  if (ctx.mode.bex !== true) {
    const urlList = quasarConf.devServer.host === '0.0.0.0'
      ? getIPList().map(ip => green(quasarConf.metaConf.getUrl(ip))).join('\n                           ')
      : green(quasarConf.metaConf.APP_URL)

    banner.push(` ${ greenBanner } App URL................ ${ urlList }`)
  }

  banner.push(
    ` ${ greenBanner } Dev mode............... ${ green(ctx.modeName + (ctx.mode.ssr && ctx.mode.pwa ? ' + pwa' : '')) }`,
    ` ${ greenBanner } Pkg quasar............. ${ green('v' + quasarPkg.version) }`,
    ` ${ greenBanner } Pkg @quasar/app-vite... ${ green('v' + cliPkg.version) }`,
    ` ${ greenBanner } Browser target......... ${ getCompilationTarget(quasarConf.build.target.browser) }`
  )

  if ([ 'electron', 'ssr' ].includes(ctx.modeName) === true) {
    banner.push(` ${ greenBanner } Node target............ ${ getCompilationTarget(quasarConf.build.target.node) }`)
  }

  if (ctx.mode.bex === true) {
    banner.push(
      line,
      ` ${ greenBanner } Load the dev extension from:`,
      `   · Chrome(ium): ${ green(quasarConf.build.distDir) }`,
      `   · Firefox:     ${ green(join(quasarConf.build.distDir, 'manifest.json')) }`,
      line,
      ` ${ greenBanner } You will need to manually refresh the browser page to see changes after recompilations.`
    )
  }

  return banner.join('\n')
}

module.exports.printDevBanner = function printDevBanner (quasarConf) {
  console.log()
  console.log(getBanner(quasarConf))
  console.log()
}
