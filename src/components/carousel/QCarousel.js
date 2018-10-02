import Vue from 'vue'

import QBtn from '../btn/QBtn.js'
import { PanelParentMixin } from '../../mixins/panel.js'

export default Vue.extend({
  name: 'QCarousel',

  mixins: [ PanelParentMixin ],

  props: {
    height: {
      type: String,
      default: '300px'
    },
    arrows: Boolean,
    controlColor: String
  },

  computed: {
    style () {
      return {
        height: this.height
      }
    },

    arrowIcon () {
      const ico = [ this.$q.icon.carousel.left, this.$q.icon.carousel.right ]
      return this.$q.i18n.rtl
        ? ico.reverse()
        : ico
    },

    computedThumbnailIcon () {
      return this.thumbnailsIcon || this.$q.icon.carousel.thumbnails
    }
  },

  methods: {
    __getContent (h) {
      const node = []

      if (this.arrows) {
        node.push(
          h(QBtn, {
            staticClass: 'q-carousel__control q-carousel__left-arrow absolute',
            props: { color: this.controlColor, icon: this.arrowIcon[0], fabMini: true, flat: true },
            // directives: [{ name: 'show', value: this.canGoToPrevious }],
            on: { click: this.previous }
          }),
          h(QBtn, {
            staticClass: 'q-carousel__control q-carousel__right-arrow absolute',
            props: { color: this.controlColor, icon: this.arrowIcon[1], fabMini: true, flat: true },
            // directives: [{ name: 'show', value: this.canGoToNext }],
            on: { click: this.next }
          })
        )
      }

      return node
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-carousel relative-position overflow-hidden',
      style: this.style,
      directives: this.panelDirectives
    }, this.__getPanelContent(h).concat(this.__getContent(h)))
  }
})
