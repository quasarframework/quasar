process.env.NODE_ENV = 'production'

{{#or componentCss directiveCss}}
const parallel = require('os').cpus().length > 1
const runJob = parallel ? require('child_process').fork : require
{{/or}}
const { join } = require('path')
const { createFolder } = require('./utils')
const { green, blue } = require('chalk')

console.log()

{{#features.ae}}
require('./script.app-ext.js').syncAppExt()
{{/features.ae}}
require('./script.clean.js')

console.log(` 📦 Building ${green('v' + require('../package.json').version)}...{{#or componentCss directiveCss}}${parallel ? blue(' [multi-threaded]') : ''}{{/or}}\n`)

createFolder('dist')

{{#or componentCss directiveCss}}
runJob(join(__dirname, './script.javascript.js'))
runJob(join(__dirname, './script.css.js'))
{{else}}
require(join(__dirname, './script.javascript.js'))
{{/or}}
