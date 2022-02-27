const { green, dim, bold } = require('chalk')

const appPaths = require('../app-paths')
const { clearConsole } = require('../helpers/logger')
const { quasarVersion, cliAppVersion, getCompilationTarget } = require('../helpers/banner-global')

const greenBanner = green('»')
const line = dim('   ———————————————————————')
const cache = {}

function getIPList () {
  // expensive operation, so cache the response
  if (cache.ipList === void 0) {
    const { getIPs } = require('../helpers/net')
    cache.ipList = getIPs().map(ip => ip === '127.0.0.1' ? 'localhost' : ip)
  }

  return cache.ipList
}

function getBanner (quasarConf) {
  const { ctx } = quasarConf
  const banner = [
    `   ${ dim(bold(new Date().toLocaleDateString())) } ${ dim(bold(new Date().toLocaleTimeString())) }`,
    '',
    ` ${greenBanner} App dir................ ${green(appPaths.appDir)}`
  ]

  if (ctx.mode.bex !== true) {
    const urlList = quasarConf.devServer.host === '0.0.0.0'
      ? getIPList().map(ip => green(quasarConf.metaConf.getUrl(ip))).join(`\n                           `)
      : green(quasarConf.build.APP_URL)

    banner.push(` ${greenBanner} App URL................ ${urlList}`)
  }

  banner.push(
    ` ${greenBanner} Dev mode............... ${green(ctx.modeName + (ctx.mode.ssr && ctx.mode.pwa ? ' + pwa' : ''))}`,
    ` ${greenBanner} Pkg quasar............. ${green('v' + quasarVersion)}`,
    ` ${greenBanner} Pkg @quasar/app-vite... ${green('v' + cliAppVersion)}`,
    ` ${greenBanner} Browser target......... ${getCompilationTarget(quasarConf.build.target.browser)}`
  )

  if ([ 'electron', 'ssr' ].includes(ctx.modeName) === true) {
    banner.push(` ${greenBanner} Node target............ ${getCompilationTarget(quasarConf.build.target.node)}`)
  }

  if (ctx.mode.bex === true) {
    banner.push(
      line,
      ` ${greenBanner} Load the dev extension from:`,
      `   · Chrome(ium): ${chalk.green(appPaths.bexDir)}`,
      `   · Firefox:     ${chalk.green(appPaths.resolve.bex('manifest.json'))}`
    )
  }

  return banner.join('\n')
}

module.exports = quasarConf => {
  clearConsole()
  console.log()
  console.log(getBanner(quasarConf))
  console.log()
}
