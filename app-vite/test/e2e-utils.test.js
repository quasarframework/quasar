import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { createServer } from 'node:net'
import { afterEach, expect, test } from 'vitest'

import { env, killTree } from './e2e-utils.js'

const processIds = []

afterEach(() => {
  // Independent fallback: a failed assertion must not leave either
  // test process running, even if killTree itself is broken.
  for (const pid of processIds.splice(0)) {
    if (pid === void 0) continue

    try {
      process.kill(pid, 'SIGKILL')
    } catch (err) {
      if (err.code !== 'ESRCH') throw err
    }
  }
})

function canListen(port) {
  return new Promise((resolve, reject) => {
    const server = createServer()
    server.once('error', err => {
      if (err.code === 'EADDRINUSE') resolve(false)
      else reject(err)
    })
    server.listen(port, '127.0.0.1', () => {
      server.close(() => resolve(true))
    })
  })
}

test('stops a process tree and releases a descendant server port', async () => {
  const serverScript = `
    const { createServer } = require('node:net')
    const server = createServer()
    server.listen(0, '127.0.0.1', () => {
      process.send({ pid: process.pid, port: server.address().port })
    })
  `
  const parentScript = `
    const { spawn } = require('node:child_process')
    const child = spawn(process.execPath, [
      '--input-type=commonjs', '-e', ${JSON.stringify(serverScript)}
    ], { stdio: ['ignore', 'ignore', 'inherit', 'ipc'] })
    child.on('message', message => process.send(message))
  `
  const child = spawn(
    process.execPath,
    ['--input-type=commonjs', '-e', parentScript],
    { env, detached: true, stdio: ['ignore', 'ignore', 'inherit', 'ipc'] }
  )
  processIds.push(child.pid)

  const [server] = await once(child, 'message', {
    signal: AbortSignal.timeout(10_000)
  })
  processIds.unshift(server.pid)
  expect(await canListen(server.port)).toBe(false)

  await killTree(child)

  await expect
    .poll(() => child.exitCode !== null || child.signalCode !== null)
    .toBe(true)
  await expect.poll(() => canListen(server.port)).toBe(true)
})
