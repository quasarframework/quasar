import { getArgv } from '../get-argv.js'

const argv = getArgv({
  port: {
    type: 'string',
    short: 'p',
    default: process.env.PORT || '4000'
  },
  hostname: {
    type: 'string',
    short: 'H',
    default: process.env.HOSTNAME || '0.0.0.0'
  },
  silent: { type: 'boolean', short: 's' },
  cors: { type: 'boolean' },
  open: { type: 'boolean', short: 'o' },
  index: { type: 'string', short: 'i', default: 'index.html' },
  sw: { type: 'boolean' },
  history: { type: 'boolean' },
  proxy: { type: 'string', short: 'P' },
  https: { type: 'boolean' },
  cert: { type: 'string', short: 'C' },
  key: { type: 'string', short: 'K' },
  'no-color': { type: 'boolean' },
  help: { type: 'boolean', short: 'h' }
})

if (argv.help) {
  console.log(`
  Description
    Start a HTTP(S) server on a folder.

  Usage
    $ quasar serve [path]
    $ quasar serve . # serve current folder

    If you serve a SSR dist folder built with Quasar CLI then
    run "node index.js" instead.

  Options
    --port, -p              Port to use (default: 4000)
    --hostname, -H          Address to use (default: 0.0.0.0)
    --silent, -s            Suppress log message
    --cors                  Enable CORS
    --open, -o              Open browser window after starting

    --index, -i <path>      Index url path (default: index.html)
    --history               Use history mode;
                              All requests fallback to /index.html,
                              or whatever "--index" parameter specifies
                              (default: false)

    --https                 Enable HTTPS
    --cert, -C [path]       Path to SSL cert file (Optional)
    --key, -K [path]        Path to SSL key file (Optional)

    --no-color              Disable colored output
    --help, -h              Displays this message

    --proxy, -P [path]      Path to proxy definition file (Optional)

  Proxy file example:
    // https://hono.dev/docs/helpers/proxy
    // "proxy" param is hono/proxy
    export default ({ app, proxy }) => {
      app.get('/proxy/:path', (c) => {
        return proxy('http://some.api.com/' + c.req.param('path'))
      })
    }
  `)

  argv.__warn?.()
  process.exit(0)
}

import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { join, isAbsolute } from 'node:path'

import { cliPkg } from '../cli-pkg.js'
import { log, warn, fatal } from '../logger.js'

const root = getAbsolutePath(argv._[0] || '.')
const resolve = path => join(root, path)

function getAbsolutePath(pathParam) {
  return isAbsolute(pathParam) ? pathParam : join(process.cwd(), pathParam)
}

const { green, gray, red } = await import('kolorist')
const { Hono } = await import('hono')

const app = new Hono()

if (argv.cors) {
  const { cors } = await import('hono/cors')

  app.use(
    '/*',
    cors({
      origin: '*',
      allowMethods: ['*'] // Allows all methods
    })
  )
}

if (!argv.silent) {
  app.use('*', async (c, next) => {
    await next()

    const ip =
      c.env?.incoming?.socket?.remoteAddress ||
      c.req.header('x-forwarded-for') ||
      'unknown'

    if (c.res.status >= 200 && c.res.status < 300) {
      console.log(
        `${green(`[${c.req.method}]`)} ${c.req.path} ${green(c.res.status)} ${gray('[' + ip + ']')} ${new Date()}`
      )
    } else {
      console.log(
        `${red(`[${c.req.method}]`)} ${c.req.path} ${red(`!! ${c.res.status}`)} ${gray('[' + ip + ']')} ${new Date()}`
      )
    }
  })
}

if (argv.proxy) {
  argv.proxy = getAbsolutePath(argv.proxy)
  if (!existsSync(argv.proxy)) {
    fatal(`Proxy definition file not found: ${argv.proxy}`)
  }

  // Import the config file
  const { default: proxyFn } = await import(argv.proxy)
  const { proxy } = await import('hono/proxy')

  proxyFn({ app, proxy })
}

if (argv.history) {
  const indexFile = resolve(argv.index)
  if (!existsSync(indexFile)) {
    fatal(`Index file not found: ${indexFile}`)
  }

  const indexFileContent = await readFile(indexFile, 'utf8')

  app.use('*', async (c, next) => {
    if (c.req.method !== 'GET') {
      return await next()
    }

    const acceptHeader = c.req.header('Accept')
    if (!acceptHeader?.includes('text/html')) {
      return await next()
    }

    const requestedFile = resolve('.' + c.req.path)
    if (existsSync(requestedFile)) {
      return await next()
    }

    return c.html(indexFileContent)
  })
}

import { serveStatic } from '@hono/node-server/serve-static'

const indexFile = argv.index.startsWith('/') ? argv.index.slice(1) : argv.index

app.use(
  '/*',
  serveStatic({
    root,
    index: indexFile,
    precompressed: true
  })
)

const getListeningUrl = hostname =>
  `http${argv.https ? 's' : ''}://${hostname}:${argv.port}`

const { getIPs } = await import('../net.js')

const getListeningBanner = () => {
  let { hostname } = argv

  if (hostname === '0.0.0.0') {
    const acc = getIPs().map(ip => ['', getListeningUrl(ip)])
    if (acc.length !== 0) {
      acc[0][0] = 'URLs in use'
      return acc
    }

    hostname = 'localhost'
  }

  return [['URL in use', getListeningUrl(hostname)]]
}

const getHttpOptions = async () => {
  if (!argv.https) {
    const { createServer } = await import('node:http')
    return {
      createServer,
      serverOptions: {
        keepAlive: true,
        keepAliveTimeout: 5000
      }
    }
  }

  let fakeCert, key, cert

  if (argv.key && argv.cert) {
    key = getAbsolutePath(argv.key)
    cert = getAbsolutePath(argv.cert)

    if (existsSync(key)) {
      key = await readFile(key)
    } else {
      fatal(`SSL key file not found: ${key}`)
    }

    if (existsSync(cert)) {
      cert = await readFile(cert)
    } else {
      fatal(`SSL cert file not found: ${cert}`)
    }
  } else {
    const { getCertificate } = await import('@quasar/ssl-certificate')
    fakeCert = await getCertificate({ log, fatal })
  }

  const { createSecureServer } = await import('node:http2')

  return {
    createServer: createSecureServer,
    serverOptions: {
      keepAlive: true,
      keepAliveTimeout: 5000,
      // so that HTTP/1.1 clients can connect too
      allowHTTP1: true,
      key: key || fakeCert,
      cert: cert || fakeCert
    }
  }
}

import { serve } from '@hono/node-server'

const server = serve({
  fetch: app.fetch,
  port: Number.parseInt(argv.port, 10),
  hostname: argv.hostname,
  ...(await getHttpOptions())
})

// graceful shutdown
process.on('SIGINT', () => {
  server.close()
  process.exit(0)
})
process.on('SIGTERM', () => {
  server.close(err => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    process.exit(0)
  })
})

await new Promise((resolveListen, rejectListen) => {
  server.once('listening', resolveListen)
  server.once('error', rejectListen)
})

const filler = ''.padEnd(20, ' ')
const info = [
  ['Quasar CLI', `v${cliPkg.version}`],
  ...getListeningBanner(),
  ['Web server root', root],
  argv.https ? ['HTTPS', 'enabled'] : '',
  ['Index file', argv.index],
  argv.history ? ['History mode', 'enabled'] : '',
  argv.cors ? ['CORS', 'enabled'] : '',
  argv.proxy ? ['Proxy file', argv.proxy] : ''
]
  .filter(Boolean)
  .map(
    msg =>
      ' ' +
      (msg[0] === '' ? filler : msg[0].padEnd(20, '.')) +
      ' ' +
      green(msg[1])
  )

console.log('\n' + info.join('\n') + '\n')

if (
  argv.open &&
  process.stdout.isTTY &&
  process.env.NODE_ENV !== 'test' &&
  (await import('ci-info').then(({ isCI }) => !isCI))
) {
  const url = getListeningUrl(
    argv.hostname === '0.0.0.0' ? 'localhost' : argv.hostname
  )

  log('Opening default browser at ' + url + '\n')
  const { default: open } = await import('open')

  // oxlint-disable-next-line unicorn/prefer-top-level-await
  open(url).catch(() => {
    warn('Failed to open default browser')
    warn()
  })
}
