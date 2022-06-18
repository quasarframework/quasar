module.exports = async function ({ scope, utils }) {
  const script = require('./ae-v1')
  await script({ scope, utils })
}
