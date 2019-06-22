const
  log = require('../helpers/logger')('app:webview'),
  {
    spawn
  } = require('../helpers/spawn'),
  onShutdown = require('../helpers/on-shutdown'),
  appPaths = require('../app-paths'),
  touch = require('touch')

class WebViewRunner {
  constructor() {
    this.pid = 0

    onShutdown(() => {
      this.stop()
    })
  }

  run(quasarConfig) {
    const
      cfg = quasarConfig.getBuildConfig(),
      url = cfg.build.APP_URL

    if (this.url === url) {
      return
    }

    if (this.pid) {
      this.stop()
    }

    this.url = url

    const args = ['--url', url]

    return this.__runWebViewCommand(
      cfg,
      ['run', '--features', 'dev'],
      args
    )
  }

  build(quasarConfig) {
    const cfg = quasarConfig.getBuildConfig()

    touch.sync(appPaths.resolve.webview('build.rs'))

    return this.__runWebViewCommand(
      cfg,
      (cfg.ctx.debug ? ['build'] : ['build', '--release']).concat(['--features', 'prod']),
      []
    )
  }

  stop() {
    return new Promise((resolve, reject) => {
      const finalize = () => {
        this.__stopWebView().then(resolve)
      }

      finalize()
    })
  }

  __runWebViewCommand(cfg, buildArgs, args) {
    return new Promise(resolve => {
      this.pid = spawn(
        'cargo',
        buildArgs.concat(['--']).concat(args),
        appPaths.webviewDir,
        code => {
          this.__cleanup()
          if (code) {
            warn(`⚠️  [FAIL] WebView CLI has failed`)
            process.exit(1)
          }
          resolve(code)
        }
      )
    })
  }

  /**__runWebViewCommand(cfg, buildArgs, args) {
    let executeAppCommand, output
    buildArgs.unshift('build')

    if (process.platform === 'darwin') {
      const appName = 'app.app/Contents/MacOS'
        appDir = appPaths.resolve.webviewDir(appName)
      if (!fs.existsSync(appDir)) {
        fs.mkdirSync(appDir)
      }
      output = path.join(appName, 'app')
      executeAppCommand = 'open'
      args.unshift('app.app')
    } else if (process.platform === 'win32') {
      buildArgs.push('-ldflags=-H windowsgui')
      output = executeAppCommand = 'app.exe'
    }
    else {
      output = 'app'
      executeAppCommand = './app'
    }

    buildArgs.push('-o')
    buildArgs.push(output)

    return new Promise(resolve => {
      spawn('go',
        buildArgs,
        appPaths.webviewDir,
        code => {
          if (code) {
            warn(`⚠️  [FAIL] go command has failed`)
            process.exit(1)
          }
          spawn(`${executeAppCommand}`,
            args, 
            appPaths.webviewDir,
            code => {
              if (code) {
                warn()
                warn(`⚠️  Webview process ended with error code: ${code}`)
                warn()
                process.exit(1)
              }

              if (this.killPromise) {
                this.killPromise()
                this.killPromise = null
              }
              else { // else it wasn't killed by us
                warn()
                warn('Webview process was killed. Exiting...')
                warn()
                process.exit(0)
              }
              resolve(code)
            }
          )
        }
      )
    })
  }*/

  __stopWebView () {
    const pid = this.pid

    if (!pid) {
      return Promise.resolve()
    }

    log('Shutting down WebView process...')
    this.pid = 0
    return new Promise((resolve, reject) => {
      this.killPromise = resolve
      process.kill(pid)
    })
  }
}

module.exports = new WebViewRunner()
