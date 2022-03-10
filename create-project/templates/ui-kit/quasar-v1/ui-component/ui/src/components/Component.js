import { QBadge } from 'quasar'

export default {
  name: '<%= componentName %>',

  render (h) {
    return h(QBadge, {
      staticClass: '<%= componentName %>',
      props: {
        label: '<%= componentName %>'
      }
    })
  }
}
