
var
  path = require('path'),
  shell = require('shelljs')

require('colors')
require('./script.clean.js')
shell.mkdir('-p', path.join(__dirname, '../dist/'))

require('./script.build.javascript')
require('./script.build.stylus')
