import { spawn, spawnSync } from 'node:child_process'
import { join } from 'node:path'

// Runs the four ui suites CONCURRENTLY on dev machines — they are
// independent (separate vitest processes, separate vite graphs), so
// wall-clock drops to the slowest suite. CI runners stay SERIAL: four
// chromium+vite processes contend badly on 2-core/7GB machines.
// Shared prerequisites are settled serially first, so the scripts'
// own pretest hooks become no-ops instead of racing.

const uiDir = join(import.meta.dirname, '..')
const scripts = [
  'test:unit',
  'test:hydration',
  'test:hydration:pwa',
  'test:e2e:ssr',
  'test:umd'
]

function prep(cmd, args) {
  const { status } = spawnSync(cmd, args, { cwd: uiDir, stdio: 'inherit' })
  if (status !== 0) process.exit(status)
}

function run(script) {
  return new Promise(resolve => {
    const child = spawn('pnpm', ['run', script], { cwd: uiDir })

    for (const stream of [child.stdout, child.stderr]) {
      let buffered = ''
      stream.on('data', chunk => {
        buffered += chunk
        const lines = buffered.split('\n')
        buffered = lines.pop()
        for (const line of lines) {
          console.log(`[${script}] ${line}`)
        }
      })
    }

    child.on('exit', code => {
      console.log(`[${script}] exited with code ${code}`)
      resolve(code ?? 1)
    })
  })
}

prep('node', ['build/ensure-fresh-build.js'])
prep('pnpm', ['exec', 'playwright', 'install', 'chromium'])

let codes
if (process.env.GITHUB_ACTIONS) {
  // serial keeps the memory footprint sane on CI runners — and
  // fail-fast, like the && chain it replaces
  codes = []
  for (const script of scripts) {
    const code = await run(script)
    codes.push(code)
    if (code !== 0) break
  }
} else {
  codes = await Promise.all(scripts.map(run))
}

process.exit(codes.find(code => code !== 0) ?? 0)
