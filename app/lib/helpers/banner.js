const { green, grey, underline } = require('chalk')
const
  getPackageJson = require('./get-package-json'),
  quasarVersion = getPackageJson('quasar').version,
  cliAppVersion = getPackageJson('@quasar/app').version

module.exports = function (argv, cmd, details) {
  let banner = ''

  if (details) {
    banner += `
 ${underline('Build succeeded')}
`
  }

  banner += `
 ${cmd === 'dev' ? 'Dev mode..........' : 'Build mode........'} ${green(argv.mode)}
 Pkg quasar........ ${green('v' + quasarVersion)}
 Pkg @quasar/app... ${green('v' + cliAppVersion)}
 Debugging......... ${cmd === 'dev' || argv.debug ? green('enabled') : grey('no')}`

  if (cmd === 'build') {
    banner += `\n Publishing........ ${argv.publish !== void 0 ? green('yes') : grey('no')}`
  }

  if (details) {
    banner += `
 ==================
 Output folder..... ${green(details.outputFolder)}`

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
      about Cordova applies to it. Quasar CLI only generates the content
      for "src-cordova/www" folder and then Cordova takes over and builds
      the mobile app.

 Tip: Feel free to use Cordova CLI or change any files in "src-cordova",
      except for "www" folder which must be built by Quasar CLI.`
    }
    else if (['spa', 'pwa'].includes(argv.mode)) {
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

module.exports.devCompilationSuccess = function (ctx, url, appDir) {
  return `App dir........... ${green(appDir)}
    App URL........... ${green(url)}
    Dev mode.......... ${green(ctx.modeName + (ctx.mode.ssr && ctx.mode.pwa ? ' + pwa' : ''))}
    Pkg quasar........ ${green('v' + quasarVersion)}
    Pkg @quasar/app... ${green('v' + cliAppVersion)}
  `
}
