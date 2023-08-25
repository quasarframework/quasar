const os = require('node:os')
const net = require('node:net')

module.exports.localHostList = [ '0.0.0.0', 'localhost', '127.0.0.1', '::1' ]

module.exports.getExternalNetworkInterface = function getExternalNetworkInterface () {
  const networkInterfaces = os.networkInterfaces()
  const devices = []

  for (const deviceName of Object.keys(networkInterfaces)) {
    const networkInterface = networkInterfaces[ deviceName ]

    for (const networkAddress of networkInterface) {
      if (!networkAddress.internal && networkAddress.family === 'IPv4') {
        devices.push({ deviceName, ...networkAddress })
      }
    }
  }

  return devices
}

module.exports.getIPs = function getIPs () {
  const networkInterfaces = os.networkInterfaces()
  const list = []

  for (const deviceName of Object.keys(networkInterfaces)) {
    const networkInterface = networkInterfaces[ deviceName ]

    for (const networkAddress of networkInterface) {
      if (networkAddress.family === 'IPv4') {
        list.push(networkAddress.address)
      }
    }
  }

  return list
}

module.exports.findClosestOpenPort = async function findClosestOpenPort (port, host) {
  let portProposal = port

  do {
    if (await isPortAvailable(portProposal, host)) {
      return portProposal
    }
    portProposal++
  }
  while (portProposal < 65535)

  throw new Error('ERROR_NETWORK_PORT_NOT_AVAIL')
}

async function isPortAvailable (port, host) {
  return new Promise((resolve, reject) => {
    const tester = net.createServer()
      .once('error', err => {
        if (err.code === 'EADDRNOTAVAIL') {
          reject(new Error('ERROR_NETWORK_ADDRESS_NOT_AVAIL'))
        }
        else if (err.code === 'EADDRINUSE') {
          resolve(false) // host/port in use
        }
        else {
          reject(err)
        }
      })
      .once('listening', () => {
        tester.once('close', () => {
          resolve(true) // found available host/port
        })
          .close()
      })
      .on('error', err => {
        reject(err)
      })
      .listen(port, host)
  })
}

module.exports.isPortAvailable = isPortAvailable
