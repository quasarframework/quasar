import assert from 'node:assert/strict'
import { X509Certificate } from 'node:crypto'
import { chmodSync, rmSync, statSync, utimesSync, writeFileSync } from 'node:fs'
import { afterEach, describe, test } from 'node:test'
import { setTimeout as delay } from 'node:timers/promises'

import { generateCertificate, getCertificate } from '../src/index.js'

const certPath = new URL('../ssl-server.pem', import.meta.url)
const callbacks = {
  log() {},
  fatal(message) {
    throw new Error(message)
  }
}

afterEach(() => {
  rmSync(certPath, { force: true })
})

describe('@quasar/ssl-certificate', () => {
  test('generates a restricted localhost server certificate', async () => {
    const content = await generateCertificate(callbacks)
    const certificate = new X509Certificate(
      content.slice(content.indexOf('-----BEGIN CERTIFICATE-----'))
    )

    if (process.platform !== 'win32') {
      assert.equal(statSync(certPath).mode & 0o777, 0o600)
    }

    assert.equal(certificate.ca, false)
    assert.deepEqual(certificate.keyUsage, ['1.3.6.1.5.5.7.3.1'])
    assert.match(certificate.subjectAltName, /DNS:localhost(?:,|$)/)
    assert.match(certificate.subjectAltName, /IP Address:127\.0\.0\.1(?:,|$)/)
    assert.match(
      certificate.subjectAltName,
      /IP Address:0:0:0:0:0:0:0:1(?:,|$)/
    )
    assert.doesNotMatch(certificate.subjectAltName, /\[::1\]|fe80::1/)
  })

  test(
    'restricts an existing cached certificate before reading it',
    { skip: process.platform === 'win32' },
    async () => {
      writeFileSync(certPath, 'cached certificate', {
        encoding: 'utf8',
        mode: 0o644
      })
      chmodSync(certPath, 0o644)

      assert.equal(await getCertificate(callbacks), 'cached certificate')
      assert.equal(statSync(certPath).mode & 0o777, 0o600)

      const repairedCtime = statSync(certPath).ctimeMs
      await delay(10)

      assert.equal(await getCertificate(callbacks), 'cached certificate')
      assert.equal(statSync(certPath).ctimeMs, repairedCtime)
    }
  )

  test('regenerates an expired cached certificate after metadata changes', async () => {
    writeFileSync(certPath, 'expired certificate', {
      encoding: 'utf8',
      mode: 0o600
    })

    const expired = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000)
    utimesSync(certPath, expired, expired)
    chmodSync(certPath, 0o600)

    const content = await getCertificate(callbacks)
    assert.notEqual(content, 'expired certificate')
    assert.match(content, /-----BEGIN CERTIFICATE-----/)
  })
})
