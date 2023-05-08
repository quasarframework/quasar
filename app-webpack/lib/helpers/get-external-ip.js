const { warn, fatal } = require('./logger')

module.exports = async function () {
  const { getExternalNetworkInterface } = require('./net')
  const interfaces = await getExternalNetworkInterface()

  if (interfaces.length === 0) {
    fatal('No external IP detected. Can\'t run without one. Manually specify one?')
  }

  if (interfaces.length === 1) {
    const address = interfaces[ 0 ].address
    warn(`Detected external IP ${ address } and using it`)
    return address
  }

  const answer = await require('inquirer').prompt([ {
    type: 'list',
    name: 'address',
    message: 'What external IP should Quasar use?',
    choices: interfaces.map(intf => intf.address)
  } ])

  return answer.address
}
