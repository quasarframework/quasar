const path = require('path')
const moduleAlias = require('module-alias')

moduleAlias.addAlias('quasar', path.join(__dirname, '..'))

// Ensure cwd is set to ui/dev
process.chdir(__dirname)

const { createFolder } = require('../build/build.utils')
const buildJavascript = require('../build/script.build.javascript')

createFolder('dist/transforms')
buildJavascript('transforms')

createFolder('dist/api')
buildJavascript('api')

import('@quasar/app-vite/lib/cmd/build.js')
