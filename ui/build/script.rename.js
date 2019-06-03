const
  fs = require('fs'),
  glob = require('glob'),
  path = require('path')

glob(path.join(__dirname, '..', 'src', 'components', '/**/*.js'), {}, (err, files) => {
  if (err) {
    return console.error(err)
  }
  else {
    const re = /(?!Q[A-Z][A-Za-z]*\.js)Q([A-Z][A-Za-z]*)/g

    for (const file of files) {
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          return console.error(err)
        }

        fs.writeFile(file, data.replace(re, 'W$1'), 'utf8', err => {
          if (err) {
            return console.error(err)
          }
        })
      })
    }
  }
})
