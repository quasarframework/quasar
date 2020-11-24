import { h, defineComponent } from 'vue'

import DarkMixin from '../../mixins/dark.js'

import { hSlot } from '../../utils/render.js'

export default defineComponent({
  name: 'QTimeline',

  mixins: [DarkMixin],

  provide () {
    return {
      __qTimeline: this
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
      validator: v => [ 'left', 'right' ].includes(v)
    },
    layout: {
      type: String,
      default: 'dense',
      validator: v => [ 'dense', 'comfortable', 'loose' ].includes(v)
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
    }, hSlot(this, 'default'))
  }
})
