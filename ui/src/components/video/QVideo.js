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
      if (this.ratio !== void 0) {
        return 'q-video--responsive'
      }
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-video',
      class: this.classes,
      style: this.ratioStyle,
      on: this.$listeners
    }, [
      h('iframe', this.iframeData)
    ])
  }
})
