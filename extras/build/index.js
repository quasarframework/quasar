const { cpus } = require('os')
const { fork } = require('child_process')
const { join } = require('path')
const { Queue, sleep, retry } = require('./utils')

const startTime = Date.now() // Add timing start

const cpuCount = cpus().length
const isParallel = cpuCount > 1
const maxJobCount = Math.max(cpuCount * 2 - 1, 1)
const runScript = isParallel ? fork : require

const materialFontVersions = {}

function handleChild(child) {
  return new Promise(resolve => {
    child.on('exit', resolve)

    if (child.stdout) {
      child.stdout.on('data', data => {
        const output = data.toString()
        if (!output.startsWith('.')) {
          console.log(output)
        }
      })
    }

    if (child.stderr) {
      child.stderr.on('data', data => {
        const errorOutput = data.toString()
        if (!errorOutput.startsWith('.')) {
          console.error(errorOutput)
        }
        errorOutput.split('\n').forEach(line => {
          if (line.endsWith('.woff2') || line.endsWith('.woff')) {
            const matches = line.match(/.*\/(.*?)/)
            if (matches) {
              const parts = matches[0].split('/')
              if (parts.length >= 3) {
                const [name, version] = parts.slice(-3, -1)
                materialFontVersions[name] = version
              }
            }
          }
        })
      })
    }
  })
}

function runJob(queue, scriptFile) {
  if (isParallel) {
    queue.push(scriptFile)
  } else {
    runScript(join(__dirname, scriptFile))
  }
}

async function generate() {
  const queue = new Queue(
    async scriptFile => {
      await retry(async ({ tries }) => {
        await sleep((tries - 1) * 100)
        const child = runScript(join(__dirname, scriptFile), [], {
          silent: true
        })
        await handleChild(child)
      })
    },
    { concurrency: maxJobCount }
  )

  const jobs = [
    './webfonts.js',
    './animate.js',
    './mdi-v7.js',
    './fontawesome-v6.js',
    './ionicons-v8.js',
    './eva-icons.js',
    './themify.js',
    './line-awesome.js',
    './bootstrap-icons.js',
    // './material-icons.js', // hasn't updated in 2 years
    './material-symbols.js',
    './utils/buildExports.js'
  ]

  for (const scriptFile of jobs) {
    await runJob(queue, scriptFile)
    if (
      [
        // './material-icons.js', // hasn't updated in 2 years
        './material-symbols.js',
        './utils/buildExports.js'
      ].includes(scriptFile)
    ) {
      await queue.wait({ empty: true })
    }
  }

  console.log(JSON.stringify(materialFontVersions, null, 2))

  // Add timing end and display duration
  const endTime = Date.now()
  const duration = endTime - startTime
  console.log(`\nTotal execution time: ${duration}ms`)
}

generate()
