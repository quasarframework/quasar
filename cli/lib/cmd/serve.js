import parseArgs from 'minimist'

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    p: 'port',
    H: 'hostname',
    g: 'gzip',
    s: 'silent',
    colors: 'colors',
    o: 'open',
    c: 'cache',
    cors: 'cors',
    m: 'micro',
    history: 'history',
    i: 'index',
    https: 'https',
    C: 'cert',
    K: 'key',
    P: 'proxy',
    h: 'help'
  },
  boolean: [ 'g', 'https', 'colors', 'history', 'h', 'cors' ],
  string: [ 'H', 'C', 'K', 'i' ],
  default: {
    p: process.env.PORT || 4000,
    H: process.env.HOSTNAME || '0.0.0.0',
    g: true,
    c: 24 * 60 * 60,
    m: 1,
    i: 'index.html',
    colors: true
  }
})

if (argv.help) {
  console.log(`
  Description
    Start a HTTP(S) server on a folder.

  Usage
    $ quasar serve [path]
    $ quasar serve . # serve current folder

    If you serve a SSR folder built with the CLI then
    control is yielded to /index.js and params have no effect.

  Options
    --port, -p              Port to use (default: 4000)
    --hostname, -H          Address to use (default: 0.0.0.0)
    --gzip, -g              Compress content (default: true)
    --silent, -s            Suppress log message
    --colors                Log messages with colors (default: true)
    --open, -o              Open browser window after starting
    --cache, -c <number>    Cache time (max-age) in seconds;
                            Does not apply to /service-worker.js
                            (default: 86400 - 24 hours)
    --micro, -m <seconds>   Use micro-cache (default: 1 second)

    --history               Use history api fallback;
                              All requests fallback to /index.html,
                              unless using "--index" parameter
    --index, -i <file>      History mode (only!) index url path
                              (default: index.html)

    --https                 Enable HTTPS
    --cert, -C [path]       Path to SSL cert file (Optional)
    --key, -K [path]        Path to SSL key file (Optional)
    --proxy <file.mjs>      Proxy specific requests defined in file;
                            File must export Array ({ path, rule })
                            See example below. "rule" is defined at:
                            https://github.com/chimurai/http-proxy-middleware
    --cors                  Enable CORS for all requests
    --help, -h              Displays this message

  Proxy file example
    export default [
      {
        path: '/api',
        rule: { target: 'http://www.example.org' }
      }
    ]
    --> will be transformed into app.use(path, httpProxyMiddleware(rule))
  `)
  process.exit(0)
}

import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'

import { cliPkg } from '../cli-pkg.js'
import { log, fatal } from '../logger.js'

const root = getAbsolutePath(argv._[ 0 ] || '.')
const resolve = p => path.resolve(root, p)

function getAbsolutePath (pathParam) {
  return path.isAbsolute(pathParam)
    ? pathParam
    : path.join(process.cwd(), pathParam)
}

const pkgFile = resolve('package.json')
const indexFile = resolve('index.js')

let ssrDetected = false

if (existsSync(pkgFile) && existsSync(indexFile)) {
  const pkg = JSON.parse(
    readFileSync(pkgFile, 'utf8')
  )

  if (pkg.quasar && pkg.quasar.ssr) {
    console.log('Quasar SSR folder detected.')
    console.log('Yielding control to its own webserver.')
    console.log()
    ssrDetected = true

    import(indexFile)
  }
}

if (ssrDetected === false) {
  if (!argv.colors) {
    process.env.FORCE_COLOR = '0'
  }

  const { default: express } = await import('express')
  const { green, gray, red } = await import('kolorist')

  const resolvedIndex = resolve(argv.index)
  const microCacheSeconds = argv.micro
    ? parseInt(argv.micro, 10)
    : false

  const serve = (path, cache) => {
    const opts = {
      maxAge: cache ? parseInt(argv.cache, 10) * 1000 : 0,
      setHeaders (res, path) {
        if (res.req.method === 'GET' && path === resolvedIndex) {
          res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
          res.set('Pragma', 'no-cache')
          res.set('Expires', '0')
          res.set('Surrogate-Control', 'no-store')
        }
      }
    }

    if (argv.history !== true) {
      opts.index = argv.index
    }

    return express.static(resolve(path), opts)
  }

  const app = express()

  if (argv.cors) {
    const { default: cors } = await import('cors')
    app.use(cors())
  }

  if (!argv.silent) {
    app.get('*', (req, _, next) => {
      console.log(
        `GET ${ green(req.url) } ${ gray('[' + req.ip + ']') } ${ new Date() }`
      )
      next()
    })
  }

  if (argv.gzip) {
    const { default: compression } = await import('compression')
    app.use(compression({ threshold: 0 }))
  }

  const serviceWorkerFile = resolve('service-worker.js')
  if (existsSync(serviceWorkerFile)) {
    app.use('/service-worker.js', serve('service-worker.js'))
  }

  if (argv.proxy) {
    let file = argv.proxy = getAbsolutePath(argv.proxy)
    if (!existsSync(file)) {
      fatal('Proxy definition file not found! ' + file)
    }
    file = await import(file)

    const { createProxyMiddleware } = await import('http-proxy-middleware')

    ;(file.default || file).forEach(entry => {
      app.use(entry.path, createProxyMiddleware(entry.rule))
    })
  }

  if (argv.history) {
    const { default: history } = await import('connect-history-api-fallback')
    app.use(
      history({
        index: argv.index.startsWith('/')
          ? argv.index
          : '/' + argv.index
      })
    )
  }

  app.use('/', serve('.', true))

  if (microCacheSeconds) {
    const { default: microcache } = await import('route-cache')
    app.use(
      microcache.cacheSeconds(
        microCacheSeconds,
        req => req.originalUrl
      )
    )
  }

  app.get('*', (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.status(404).send('404 | Page Not Found')
    if (!argv.silent) {
      console.log(red(`  404 on ${ req.url }`))
    }
  })

  const getServer = async app => {
    if (!argv.https) {
      return app
    }

    let fakeCert, key, cert

    if (argv.key && argv.cert) {
      key = getAbsolutePath(argv.key)
      cert = getAbsolutePath(argv.cert)

      if (existsSync(key)) {
        key = readFileSync(key)
      }
      else {
        fatal('SSL key file not found!' + key)
      }

      if (existsSync(cert)) {
        cert = readFileSync(cert)
      }
      else {
        fatal('SSL cert file not found!' + cert)
      }
    }
    else {
      const { getCertificate } = await import('@quasar/ssl-certificate')
      fakeCert = getCertificate({ log, fatal })
    }

    const https = await import('node:https')
    return https.createServer({
      key: key || fakeCert,
      cert: cert || fakeCert
    }, app)
  }

  const server = await getServer(app)

  const getListeningUrl = hostname => {
    return `http${ argv.https ? 's' : '' }://${ hostname }:${ argv.port }`
  }

  const { getIPs } = await import('../net.js')

  const getListeningBanner = () => {
    let { hostname } = argv

    if (hostname === '0.0.0.0') {
      const acc = getIPs().map(ip => ([ '', getListeningUrl(ip) ]))
      if (acc.length !== 0) {
        acc[ 0 ][ 0 ] = 'Listening at'
        return acc
      }

      hostname = 'localhost'
    }

    return [
      [ 'Listening at', getListeningUrl(hostname) ]
    ]
  }

  server.listen(argv.port, argv.hostname, async () => {
    const filler = ''.padEnd(20, ' ')
    const info = [
      [ 'Quasar CLI', `v${ cliPkg.version }` ],
      ...getListeningBanner(),
      [ 'Web server root', root ],
      argv.https ? [ 'HTTPS', 'enabled' ] : '',
      argv.gzip ? [ 'Gzip', 'enabled' ] : '',
      [ 'Cache (max-age)', argv.cache || 'disabled' ],
      microCacheSeconds ? [ 'Micro-cache', microCacheSeconds + 's' ] : '',
      argv.history ? [ 'History mode', 'enabled' ] : '',
      [ 'Index file', argv.index ],
      argv.cors ? [ 'CORS', 'enabled' ] : '',
      argv.proxy ? [ 'Proxy definitions', argv.proxy ] : ''
    ]
      .filter(msg => msg)
      .map(msg => ' ' + (msg[ 0 ] !== '' ? msg[ 0 ].padEnd(20, '.') : filler) + ' ' + green(msg[ 1 ]))

    console.log('\n' + info.join('\n') + '\n')

    if (argv.open) {
      const { isMinimalTerminal } = await import('../is-minimal-terminal.js')
      if (!isMinimalTerminal) {
        const { default: open } = await import('open')
        open(getListeningUrl(argv.hostname), { url: true })
      }
    }
  })
}
