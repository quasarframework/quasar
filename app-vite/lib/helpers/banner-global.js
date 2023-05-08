const { green, gray, underline } = require('kolorist')

const getPackageJson = require('./get-package-json')
const quasarVersion = getPackageJson('quasar').version
const cliAppVersion = require('../../package.json').version
const viteVersion = require('vite/package.json').version

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

module.exports = function (argv, cmd, details = {}) {
  let banner = ''

  if (details.buildOutputFolder) {
    banner += ` ${ underline('Build succeeded') }\n`
  }

  banner += `
 ${ cmd === 'dev' ? 'Dev mode...............' : 'Build mode.............' } ${ green(argv.mode) }
 Pkg quasar............. ${ green('v' + quasarVersion) }
 Pkg @quasar/app-vite... ${ green('v' + cliAppVersion) }
 Pkg vite............... ${ green('v' + viteVersion) }
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

  if (details.target) {
    banner += `\n Browser target......... ${ getCompilationTarget(details.target.browser) }`
    if ([ 'electron', 'ssr' ].includes(argv.mode)) {
      banner += `\n Node target............ ${ getCompilationTarget(details.target.node) }`
    }
  }

  if (details.buildOutputFolder) {
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

module.exports.quasarVersion = quasarVersion
module.exports.cliAppVersion = cliAppVersion
module.exports.getCompilationTarget = getCompilationTarget
