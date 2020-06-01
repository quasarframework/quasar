const { warn } = require('./helpers/logger')

const version = process.version.split('.')
const major = parseInt(version[0].replace(/\D/g, ''), 10)
// const minor = parseInt(version[1].replace(/\D/g,''), 10)

if (major < 10) {
  warn('INCOMPATIBLE NODE VERSION')
  warn('Quasar CLI requires Node 10.0.0 or superior')
  warn('')
  warn('You are running Node ' + version)
  warn('Please install a compatible Node version and try again')

  process.exit(1)
}
