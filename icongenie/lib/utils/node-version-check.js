const version = process.version.split('.')
const major = parseInt(version[0].replace(/\D/g,''), 10)
// const minor = parseInt(version[1].replace(/\D/g,''), 10)

if (major < 10) {
  console.warn('\x1b[41m%s\x1b[0m', 'INCOMPATIBLE NODE VERSION')
  console.warn('\x1b[33m%s\x1b[0m', 'Quasar CLI requires Node 10.0.0 or superior')
  console.warn('')
  console.warn('⚠️  You are running Node ' + version)
  console.warn('Please install a compatible Node version and try again')

  process.exit(1)
}
