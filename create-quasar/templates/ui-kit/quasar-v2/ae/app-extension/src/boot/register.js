import { boot } from 'quasar/wrappers'
import VuePlugin from 'quasar-ui-<%= name %>'

export default boot(({ app }) => {
  app.use(VuePlugin)
})
