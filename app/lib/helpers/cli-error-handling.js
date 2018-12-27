const pe = require('pretty-error').start()

pe.skipPackage('regenerator-runtime')
pe.skipPackage('babel-runtime')
pe.skipNodeFiles()

let ouchInstance

module.exports.getOuchInstance = function () {
  if (ouchInstance) {
    return ouchInstance
  }

  pe.stop()

  const Ouch = require('ouch')
  ouchInstance = (new Ouch()).pushHandler(
    new Ouch.handlers.PrettyPageHandler('orange', null, 'sublime')
  )

  return ouchInstance
}
