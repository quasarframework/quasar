const
  fs = require('fs'),
  glob = require('glob'),
  path = require('path'),
  { renameComponents } = require('./build.rename')

glob(path.join(__dirname, '..', 'src', 'components', '/**/*.js'), {}, (err, files) => {
  if (err) {
    return console.error(err)
  }
  else {
    for (const file of files) {
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          return console.error(err)
        }

        fs.writeFile(file, renameComponents(data), 'utf8', err => {
          if (err) {
            return console.error(err)
          }
        })
      })
    }
  }
})
