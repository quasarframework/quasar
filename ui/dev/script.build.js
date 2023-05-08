const path = require('path')
const moduleAlias = require('module-alias')

moduleAlias.addAlias('quasar', path.join(__dirname, '..'))

// Ensure cwd is set to ui/dev
process.chdir(__dirname)

require('@quasar/app-vite/lib/cmd/build')
