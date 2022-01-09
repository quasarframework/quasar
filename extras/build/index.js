const { writeFileSync } = require('fs')
const cpus = require('os').cpus().length
const parallel = cpus > 1
const maxJobCount = cpus - 1 || 1
const run = parallel ? require('child_process').fork : require
const { resolve, join } = require('path')
const { Queue, sleep, retry } = require('./utils')

const materialFontVersions = {}

async function generate () {
  function handleChild (child) {
    return new Promise((resolve, reject) => {
      // watch for exit event
      child.on('exit', (code, signal) => {
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

  // this one takes the longest, queue it up first
  runJob('./material-icons.js')

  runJob('./webfonts.js')
  runJob('./animate.js')

  runJob('./mdi-v6.js')
  runJob('./fontawesome-v5.js')
  runJob('./ionicons-v6.js')
  runJob('./eva-icons.js')
  runJob('./themify.js')
  runJob('./line-awesome.js')
  runJob('./bootstrap-icons.js')

  // don't exit before everything is done
  await queue.wait({ empty: true })

  console.log(JSON.stringify(materialFontVersions, null, 2))
}

generate()
