import { X509Certificate } from 'node:crypto'
import { chmodSync, rmSync, statSync, utimesSync, writeFileSync } from 'node:fs'
import { setTimeout as delay } from 'node:timers/promises'
import { afterEach, describe, expect, test } from 'vitest'

import { generateCertificate, getCertificate } from './index.js'

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
      expect(statSync(certPath).mode & 0o777).toBe(0o600)
    }

    expect(certificate.ca).toBe(false)
    expect(certificate.keyUsage).toEqual(['1.3.6.1.5.5.7.3.1'])
    expect(certificate.subjectAltName).toMatch(/DNS:localhost(?:,|$)/)
    expect(certificate.subjectAltName).toMatch(/IP Address:127\.0\.0\.1(?:,|$)/)
    expect(certificate.subjectAltName).toMatch(
      /IP Address:0:0:0:0:0:0:0:1(?:,|$)/
    )
    expect(certificate.subjectAltName).not.toMatch(/\[::1\]|fe80::1/)
  })

  test.skipIf(process.platform === 'win32')(
    'restricts an existing cached certificate before reading it',
    async () => {
      writeFileSync(certPath, 'cached certificate', {
        encoding: 'utf8',
        mode: 0o644
      })
      chmodSync(certPath, 0o644)

      expect(await getCertificate(callbacks)).toBe('cached certificate')
      expect(statSync(certPath).mode & 0o777).toBe(0o600)

      const repairedCtime = statSync(certPath).ctimeMs
      await delay(10)

      expect(await getCertificate(callbacks)).toBe('cached certificate')
      expect(statSync(certPath).ctimeMs).toBe(repairedCtime)
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
    expect(content).not.toBe('expired certificate')
    expect(content).toMatch(/-----BEGIN CERTIFICATE-----/)
  })
})
