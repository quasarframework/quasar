const
  fs = require('fs'),
  path = require('path'),
  zlib = require('zlib')

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

module.exports.writeFile = function (dest, code, zip) {
  const banner = dest.indexOf('.js') > -1
    ? '[js]'
    : '[css]'

  return new Promise((resolve, reject) => {
    function report (extra) {
      console.log(`${banner} ${path.relative(process.cwd(), dest).bold} ${getSize(code).gray}${extra || ''}`)
      resolve(code)
    }

    fs.writeFile(dest, code, err => {
      if (err) return reject(err)
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          report(` (gzipped: ${getSize(zipped)})`)
        })
      }
      else {
        report()
      }
    })
  })
}

module.exports.readFile = function (file) {
  return fs.readFileSync(file, 'utf-8')
}

module.exports.logError = function (err) {
  console.error('[Error]'.red, err)
}
