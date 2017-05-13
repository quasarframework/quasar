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
    count: [Number, String],
    color: String
  },
  inject: ['data', 'selectTab'],
  computed: {
    active () {
      return this.data.tabName === this.name
    },
    classes () {
      const cls = {
        active: this.active,
        hidden: this.hidden,
        disabled: this.disable,
        'icon-and-label': this.icon && this.label,
        'hide-icon': this.hide === 'icon',
        'hide-label': this.hide === 'label'
      }

      const color = this.data.inverted
        ? this.color || this.data.color
        : this.color

      if (color) {
        cls[`text-${color}`] = this.$q.theme === 'ios' ? this.active : true
      }

      return cls
    },
    borderClasses () {
      if (this.data.inverted && this.data.color) {
        return `text-${this.data.color}`
      }
    }
  }
}
