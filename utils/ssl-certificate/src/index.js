
import { existsSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import fse from 'fs-extra'
import { generate } from 'selfsigned'

const certPath = new URL('../ssl-server.pem', import.meta.url)

export function generateCertificate ({
  log,
  fatal
}) {
  log('Generating self signed localhost SSL Certificate...')

  const attrs = [
    { name: 'commonName', value: 'localhost' }
  ]

  const pems = generate(attrs, {
    algorithm: 'sha256',
    days: 30,
    keySize: 2048,
    extensions: [
      {
        name: 'basicConstraints',
        cA: true
      },
      {
        name: 'keyUsage',
        keyCertSign: true,
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true
      },
      {
        name: 'extKeyUsage',
        serverAuth: true,
        clientAuth: true,
        codeSigning: true,
        timeStamping: true
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
            type: 2,
            value: '[::1]'
          },
          {
            // type 7 is IP
            type: 7,
            ip: '127.0.0.1'
          },
          {
            type: 7,
            ip: 'fe80::1'
          }
        ]
      }
    ]
  })

  const certContent = pems.private + pems.cert
  try {
    writeFileSync(certPath, certContent, 'utf-8')
  }
  catch (err) {
    console.error(err)
    fatal('Cannot write localhost SSL certificate to: ' + certPath + '. Aborting...')
  }

  return certContent
}

export function getCertificate ({
  log,
  fatal
}) {
  let certExists = existsSync(certPath)

  if (certExists === true) {
    const certStat = statSync(certPath)
    const certTtl = 1000 * 60 * 60 * 24
    const now = new Date()

    // cert is more than 30 days old
    if ((now - certStat.ctime) / certTtl > 30) {
      log('Localhost SSL Certificate is more than 30 days old. Removing.')
      fse.removeSync(certPath)
      certExists = false
    }
  }

  return certExists === true
    ? readFileSync(certPath, 'utf-8')
    : generateCertificate({ log, fatal })
}
