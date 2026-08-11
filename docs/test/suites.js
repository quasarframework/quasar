import { spawn, spawnSync } from 'node:child_process'
import { join } from 'node:path'

// Runs test:e2e:ssr then test:build SEQUENTIALLY — they cannot
// overlap: `quasar build` and `quasar dev` share mutable app state
// (.quasar, node_modules/.q-cache), and a build regenerating them in
// SSG mode breaks the concurrently-running dev server's renders.
// The speed levers are elsewhere: test:build self-heals through the
// build stamp (skipped entirely on unchanged inputs) and the e2e can
// reuse a running dev server through E2E_SERVER_URL.
// Shared prerequisites are settled first, so the scripts' own pretest
// hooks become no-ops.

const docsDir = join(import.meta.dirname, '..')

function prep(cmd, args) {
  const { status } = spawnSync(cmd, args, { cwd: docsDir, stdio: 'inherit' })
  if (status !== 0) process.exit(status)
}

function run(script) {
  return new Promise(resolve => {
    const child = spawn('pnpm', ['run', script], { cwd: docsDir })

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

prep('node', ['../ui/build/ensure-fresh-build.js'])
prep('pnpm', ['exec', 'playwright', 'install', 'chromium'])

for (const script of ['test:e2e:ssr', 'test:build']) {
  const code = await run(script)
  if (code !== 0) process.exit(code)
}
