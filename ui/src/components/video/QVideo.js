import { h, defineComponent } from 'vue'

import RatioMixin from '../../mixins/ratio.js'

export default defineComponent({
  name: 'QVideo',

  mixins: [ RatioMixin ],

  props: {
    src: {
      type: String,
      required: true
    }
  },

  computed: {
    classes () {
      return 'q-video' +
        (this.ratio !== void 0 ? ' q-video--responsive' : '')
    }
  },

  render () {
    return h('div', {
      class: this.classes,
      style: this.ratioStyle
    }, [
      h('iframe', {
        src: this.src,
        frameborder: '0',
        allowfullscreen: true
      })
    ])
  }
})
