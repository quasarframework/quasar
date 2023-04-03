const cpus = require('os').cpus().length
const parallel = cpus > 1
const maxJobCount = cpus * 2 - 1 || 1
const run = parallel ? require('child_process').fork : require
const { join } = require('path')
const { Queue, sleep, retry } = require('./utils')

const materialFontVersions = {}

async function generate () {
  function handleChild (child) {
    return new Promise((resolve) => {
      // watch for exit event
      child.on('exit', (_code, _signal) => {
        resolve()
      })

      if (child.stdout) {
        child.stdout.on('data', (data) => {
          const str = data.toString()
          if (!str.startsWith('.')) {
            console.log(str)
          }
        })
      }

      if (child.stderr) {
        child.stderr.on('data', (data) => {
          const str = data.toString()
          if (!str.startsWith('.')) {
            console.error(str)
          }
          const lines = str.split('\n')
          lines.map(line => {
            if (line.endsWith('.woff2')) {
              const parts = line.match(/.*\/(.*?)/)[0].split('/')
              if (parts.length) {
                const version = parts[ parts.length - 2 ]
                const name = parts[ parts.length - 3 ]
                materialFontVersions[name] = version
              }
            }
          })
        })
      }
    })
  }

  const queue = new Queue(
    async (scriptFile) => {
      await retry(async ({ tries }) => {
        await sleep((tries - 1) * 100)
        const child = run(join(__dirname, scriptFile), [], { silent: true })
        await handleChild(child)
      })
    },
    { concurrency: maxJobCount },
  )

  function runJob (scriptFile) {
    if (parallel) {
      queue.push(scriptFile)
      return
    }
    return run(join(__dirname, scriptFile))
  }

  // run the material svg icon jobs
  runJob('./webfonts.js')
  runJob('./animate.js')

  runJob('./mdi-v7.js')
  runJob('./fontawesome-v6.js')
  runJob('./ionicons-v7.js')
  runJob('./eva-icons.js')
  runJob('./themify.js')
  runJob('./line-awesome.js')
  runJob('./bootstrap-icons.js')

  // don't exit before everything is done
  await queue.wait({ empty: true })

  // run the material svg icon jobs
  runJob('./material-icons.js')
  runJob('./material-symbols.js')

  // don't exit before everything is done
  await queue.wait({ empty: true })

  runJob('./utils/buildExports.js')

  // don't exit before everything is done
  await queue.wait({ empty: true })

  console.log(JSON.stringify(materialFontVersions, null, 2))
}

generate()
