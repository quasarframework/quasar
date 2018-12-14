const warn = require('./logger')('app:external-ip')

module.exports = async function () {
  const interfaces = await require('./net').getExternalNetworkInterface()

  if (interfaces.length === 0) {
    warn(`⚠️  No external IP detected. Can't run without one. Manually specify one?`)
    warn()
    process.exit(1)
  }

  if (interfaces.length === 1) {
    const address = interfaces[0].address
    warn(`Detected external IP ${address} and using it`)
    return address
  }

  const answer = await require('inquirer').prompt([{
    type: 'list',
    name: 'address',
    message: 'What external IP should Quasar use?',
    choices: interfaces.map(interface => interface.address)
  }])

  return answer.address
}
