import Vue from 'vue'

export default Vue.extend({
  name: 'QVideo',

  props: {
    src: {
      type: String,
      required: true
    },

    ratio: Number
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
    },

    style () {
      if (this.ratio !== void 0) {
        return { paddingTop: (100 / this.ratio) + '%' }
      }
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-video',
      class: this.classes,
      style: this.style,
      on: this.$listeners
    }, [
      h('iframe', this.iframeData)
    ])
  }
})
