import os from 'os'

export function getExternalNetworkInterface () {
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
