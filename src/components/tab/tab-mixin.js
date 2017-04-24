import uid from '../../utils/uid'

export default {
  props: {
    label: String,
    icon: String,
    disable: Boolean,
    hidden: Boolean,
    hide: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default () {
        return uid()
      }
    },
    alert: Boolean,
    count: [Number, String]
  },
  inject: ['data', 'selectTab'],
  computed: {
    active () {
      return this.data.tabName === this.name
    }
  }
}
