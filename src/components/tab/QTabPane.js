export default {
  name: 'QTabPane',
  inject: {
    data: {
      default () {
        console.error('QTabPane needs to be child of QTabs')
      }
    }
  },
  props: {
    name: {
      type: String,
      required: true
    },
    keepAlive: Boolean
  },
  data () {
    return {
      shown: false
    }
  },
  computed: {
    active () {
      return this.data.tabName === this.name
    },
    classes () {
      return {
        hidden: !this.active,
        'animate-fade-left': this.data.direction === 'left',
        'animate-fade-right': this.data.direction === 'right'
      }
    }
  },
  render (h) {
    const node = h(
      'div',
      {
        staticClass: 'q-tab-pane',
        'class': this.classes
      },
      this.$slots.default
    )

    if (this.keepAlive) {
      if (!this.shown && !this.active) {
        return
      }
      this.shown = true
      return node
    }
    else {
      this.shown = this.active
      if (this.active) {
        return node
      }
    }
  }
}
