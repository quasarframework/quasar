import { green, gray, underline, dim } from 'kolorist'
import { join } from 'node:path'

import { cliPkg } from '../utils/cli-runtime.js'
import { getIPs } from '../utils/net.js'

function getPackager (argv, cmd) {
  if (argv.ide || (argv.mode === 'capacitor' && cmd === 'dev')) {
    return 'IDE (manual)'
  }

  if (argv.mode === 'cordova') {
    return 'cordova'
  }

  return argv.target === 'ios'
    ? 'xcodebuild'
    : 'gradle'
}

function getCompilationTarget (target) {
  return green(
    Array.isArray(target) === true
      ? target.join('|')
      : target
  )
}

export function displayBanner ({ argv, ctx, cmd, details }) {
  let banner = ''

  if (details?.buildOutputFolder) {
    banner += ` ${ underline('Build succeeded') }\n`
  }

  banner += `
 ${ cmd === 'dev' ? 'Dev mode...............' : 'Build mode.............' } ${ green(argv.mode) }
 Pkg quasar............. ${ green('v' + ctx.pkg.quasarPkg.version) }
 Pkg @quasar/app-vite... ${ green('v' + cliPkg.version) }
 Pkg vite............... ${ green('v' + ctx.pkg.vitePkg.version) }
 Debugging.............. ${ cmd === 'dev' || argv.debug ? green('enabled') : gray('no') }`

  if (cmd === 'build') {
    banner += `\n Publishing............. ${ argv.publish !== void 0 ? green('yes') : gray('no') }`
  }

  if ([ 'cordova', 'capacitor' ].includes(argv.mode)) {
    const packaging = argv[ 'skip-pkg' ]
      ? gray('skip')
      : green(getPackager(argv, cmd))

    banner += cmd === 'build'
      ? `\n Packaging mode......... ${ packaging }`
      : `\n Running mode........... ${ packaging }`
  }

  if (details?.target) {
    banner += `\n Browser target......... ${ getCompilationTarget(details.target.browser) }`
    if ([ 'electron', 'ssr' ].includes(argv.mode)) {
      banner += `\n Node target............ ${ getCompilationTarget(details.target.node) }`
    }
  }

  if (details?.buildOutputFolder) {
    if (argv[ 'skip-pkg' ] !== true) {
      banner += `
 =======================
 Output folder.......... ${ green(details.buildOutputFolder) }`
    }

    if (argv.mode === 'ssr') {
      banner += `

 Tip: The output folder must be yarn/npm installed before using it,
      except when it is run inside your already yarn/npm installed project folder.

 Tip: Notice the package.json generated, where there's a script defined:
        "start": "node index.js"
      Running "$ yarn start" or "$ npm run start" from the output folder will
      start the webserver. Alternatively you can call "$ node index.js"
      yourself.`
    }
    else if (argv.mode === 'cordova') {
      banner += `

 Tip: "src-cordova" is a Cordova project folder, so everything you know
      about Cordova applies to it. Quasar CLI only generates UI the content
      for "src-cordova/www" folder and then Cordova takes over and builds
      the final packaged file.

 Tip: Feel free to use Cordova CLI ("cordova <params>") or change any files
      in "src-cordova", except for "www" folder which must be built by Quasar CLI.`
    }
    else if (argv.mode === 'capacitor') {
      banner += `

 Tip: "src-capacitor" is a Capacitor project folder, so everything you know
      about Capacitor applies to it. Quasar CLI generates the UI content
      for "src-capacitor/www" folder and then either opens the IDE or calls
      the platform's build commands to generate the final packaged file.

 Tip: Feel free to use Capacitor CLI ("yarn capacitor <params>" or
      "npx capacitor <params>") or change any files in "src-capacitor", except
      for the "www" folder which must be built by Quasar CLI.`
    }
    else if ([ 'spa', 'pwa' ].includes(argv.mode)) {
      banner += `

 Tip: Built files are meant to be served over an HTTP server
      Opening index.html over file:// won't work

 Tip: You can use "$ quasar serve" command to create a web server,
      both for testing or production. Type "$ quasar serve -h" for
      parameters. Also, an npm script (usually named "start") can
      be added for deployment environments.
      If you're using Vue Router "history" mode, don't forget to
      specify the "--history" parameter: "$ quasar serve --history"`
    }
  }

  console.log(banner + '\n')
}

const greenBanner = green('»')
const line = dim('   ———————————————————————')
const cache = {}

function getIPList () {
  // expensive operation, so cache the response
  if (cache.ipList === void 0) {
    cache.ipList = getIPs().map(ip => (ip === '127.0.0.1' ? 'localhost' : ip))
  }

  return cache.ipList
}

export function printDevRunningBanner (quasarConf) {
  const { ctx } = quasarConf

  const banner = [
    ` ${ greenBanner } Reported at............ ${ dim(new Date().toLocaleDateString()) } ${ dim(new Date().toLocaleTimeString()) }`,
    ` ${ greenBanner } App dir................ ${ green(ctx.appPaths.appDir) }`
  ]

  if (ctx.mode.bex !== true) {
    const urlList = quasarConf.devServer.host === '0.0.0.0'
      ? getIPList().map(ip => green(quasarConf.metaConf.getUrl(ip))).join('\n                           ')
      : green(quasarConf.metaConf.APP_URL)

    banner.push(` ${ greenBanner } App URL................ ${ urlList }`)
  }

  banner.push(
    ` ${ greenBanner } Dev mode............... ${ green(ctx.modeName + (ctx.mode.ssr && ctx.mode.pwa ? ' + pwa' : '')) }`,
    ` ${ greenBanner } Pkg quasar............. ${ green('v' + ctx.pkg.quasarPkg.version) }`,
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

  console.log()
  console.log(banner.join('\n'))
  console.log()
}
