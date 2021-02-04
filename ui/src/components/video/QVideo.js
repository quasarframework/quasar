import Vue from 'vue'

import RatioMixin from '../../mixins/ratio.js'
import ListenersMixin from '../../mixins/listeners.js'

export default Vue.extend({
  name: 'QVideo',

  mixins: [ RatioMixin, ListenersMixin ],

  props: {
    src: {
      type: String,
      required: true
    }
  },

  computed: {
    iframeData () {
      return {
        attrs: {
          src: this.src,
          frameborder: '0',
          allowfullscreen: true
        }
      }
    },

    classes () {
      return 'q-video' +
        (this.ratio !== void 0 ? ' q-video--responsive' : '')
    }
  },

  render (h) {
    return h('div', {
      class: this.classes,
      style: this.ratioStyle,
      on: { ...this.qListeners }
    }, [
      h('iframe', this.iframeData)
    ])
  }
})
