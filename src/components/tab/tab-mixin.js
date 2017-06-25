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
      const sel = this.data.tabName === this.name
      if (sel) {
        this.$emit('select', this.name)
      }
      return sel
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
    barStyle () {
      if (!this.active || !this.data.highlight) {
        return 'display: none;'
      }
    }
  }
}
