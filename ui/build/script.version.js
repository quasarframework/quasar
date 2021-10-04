const fs = require('fs')
const path = require('path')

//  get version
const version = require('../package.json').version

// read in the template as text
let template = fs.readFileSync(path.resolve(__dirname, './version/version.template'), 'utf-8')

// do the replacement
template = template.replace('__QUASAR_VERSION__', version)

// write the file
fs.writeFileSync(path.resolve(__dirname, '../src/version.js'), template, 'utf-8')
