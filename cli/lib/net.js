const os = require('os')
const net = require('net')

module.exports.getExternalNetworkInterface = function () {
  const
    networkInterfaces = os.networkInterfaces();
    const devices = []

  for (let deviceName of Object.keys(networkInterfaces)) {
    const networkInterface = networkInterfaces[deviceName]

    for (let networkAddress of networkInterface) {
      if (!networkAddress.internal && networkAddress.family === 'IPv4') {
        devices.push({ deviceName, ...networkAddress })
      }
    }
  }

  return devices
}
