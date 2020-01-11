import Vue from 'vue'

import RatioMixin from '../../mixins/ratio.js'

export default Vue.extend({
  name: 'QVideo',

  mixins: [ RatioMixin ],

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
      on: this.$listeners
    }, [
      h('iframe', this.iframeData)
    ])
  }
})
