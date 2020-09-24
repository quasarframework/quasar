import { h, defineComponent } from 'vue'

import DarkMixin from '../../mixins/dark.js'

import { slot } from '../../utils/slot.js'

export default defineComponent({
  name: 'QTimeline',

  mixins: [ DarkMixin ],

  provide () {
    return {
      __timeline: this
    }
  },

  props: {
    color: {
      type: String,
      default: 'primary'
    },
    side: {
      type: String,
      default: 'right',
      validator: v => ['left', 'right'].includes(v)
    },
    layout: {
      type: String,
      default: 'dense',
      validator: v => ['dense', 'comfortable', 'loose'].includes(v)
    }
  },

  computed: {
    classes () {
      return `q-timeline q-timeline--${this.layout} q-timeline--${this.layout}--${this.side}` +
        (this.isDark === true ? ' q-timeline--dark' : '')
    }
  },

  render () {
    return h('ul', {
      class: this.classes
    }, slot(this, 'default'))
  }
})
