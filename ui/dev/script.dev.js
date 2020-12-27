const path = require('path')
const moduleAlias = require('module-alias')

moduleAlias.addAlias('quasar', path.join(__dirname, '..'))

require('@quasar/app/bin/quasar-dev')
