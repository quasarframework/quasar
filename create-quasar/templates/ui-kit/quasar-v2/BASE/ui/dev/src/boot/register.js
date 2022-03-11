import { boot } from 'quasar/wrappers'
import VuePlugin from 'ui' // "ui" is aliased in quasar.conf.js

export default boot(({ app }) => {
  app.use(VuePlugin)
})
