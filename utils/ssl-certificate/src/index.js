import {
  chmodSync,
  existsSync,
  readFileSync,
  statSync,
  writeFileSync
} from 'node:fs'
import fse from 'fs-extra'
import { generate } from 'selfsigned'

const certPath = new URL('../ssl-server.pem', import.meta.url)

export async function generateCertificate({ log, fatal }) {
  log('Generating self signed localhost SSL Certificate...')

  const attrs = [{ name: 'commonName', value: 'localhost' }]

  const notAfterDate = new Date()
  notAfterDate.setDate(notAfterDate.getDate() + 30)

  const pems = await generate(attrs, {
    algorithm: 'sha256',
    notAfterDate,
    keySize: 2048,
    extensions: [
      {
        name: 'basicConstraints',
        cA: false,
        critical: true
      },
      {
        name: 'keyUsage',
        digitalSignature: true,
        keyEncipherment: true,
        critical: true
      },
      {
        name: 'extKeyUsage',
        serverAuth: true
      },
      {
        name: 'subjectAltName',
        altNames: [
          {
            // type 2 is DNS
            type: 2,
            value: 'localhost'
          },
          {
            type: 2,
            value: 'localhost.localdomain'
          },
          {
            type: 2,
            value: 'lvh.me'
          },
          {
            type: 2,
            value: '*.lvh.me'
          },
          {
            type: 7,
            ip: '::1'
          },
          {
            // type 7 is IP
            type: 7,
            ip: '127.0.0.1'
          }
        ]
      }
    ]
  })

  const certContent = pems.private + pems.cert
  try {
    writeFileSync(certPath, certContent, {
      encoding: 'utf8',
      mode: 0o600
    })
    chmodSync(certPath, 0o600)
  } catch (err) {
    console.error(err)
    fatal(
      'Cannot write localhost SSL certificate to: ' + certPath + '. Aborting...'
    )
  }

  return certContent
}

export async function getCertificate({ log, fatal }) {
  let certExists = existsSync(certPath)

  if (certExists) {
    const certStat = statSync(certPath)
    const certTtl = 1000 * 60 * 60 * 24
    const now = new Date()

    // cert is more than 30 days old
    if ((now - certStat.mtime) / certTtl > 30) {
      log('Localhost SSL Certificate is more than 30 days old. Removing.')
      fse.removeSync(certPath)
      certExists = false
    } else if (
      process.platform !== 'win32' &&
      (certStat.mode & 0o777) !== 0o600
    ) {
      try {
        chmodSync(certPath, 0o600)
      } catch (err) {
        console.error(err)
        fatal(
          'Cannot restrict localhost SSL certificate permissions at: ' +
            certPath +
            '. Aborting...'
        )
      }
    }
  }

  return certExists
    ? readFileSync(certPath, 'utf8')
    : await generateCertificate({ log, fatal })
}
