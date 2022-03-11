import { h } from 'vue'
import { QBadge } from 'quasar'

export default {
  name: '<%= componentName %>',

  setup () {
    return () => h(QBadge, {
      class: '<%= componentName %>',
      label: '<%= componentName %>'
    })
  }
}
