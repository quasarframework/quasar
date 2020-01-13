import Vue from 'vue'

import QBtn from '../btn/QBtn.js'

import DarkMixin from '../../mixins/dark.js'
import { PanelParentMixin } from '../../mixins/panel.js'
import FullscreenMixin from '../../mixins/fullscreen.js'

import { isNumber } from '../../utils/is.js'
import { mergeSlot } from '../../utils/slot.js'
import { cache } from '../../utils/vm.js'

export default Vue.extend({
  name: 'QCarousel',

  mixins: [ DarkMixin, PanelParentMixin, FullscreenMixin ],

  props: {
    height: String,
    padding: Boolean,

    transitionPrev: {
      default: 'fade'
    },
    transitionNext: {
      default: 'fade'
    },

    controlColor: String,
    autoplay: [Number, Boolean],

    arrows: Boolean,
    arrowsVertical: Boolean,
    prevIcon: String,
    nextIcon: String,

    navigation: Boolean,
    navigationPosition: {
      type: String,
      default: 'bottom',
      validator: v => ['top', 'right', 'bottom', 'left'].includes(v)
    },
    navigationIcon: String,

    thumbnails: Boolean
  },

  computed: {
    style () {
      if (this.inFullscreen !== true && this.height !== void 0) {
        return {
          height: this.height
        }
      }
    },

    classes () {
      return {
        fullscreen: this.inFullscreen,
        [`q-carousel--arrows${this.arrowsVertical === true ? '--vertical' : ''}`]: this.padding === true && this.arrows === true,
        [`q-carousel--navigation--${this.navigationPosition}`]: this.padding === true && this.navigation === true,
        'q-carousel--dark q-dark': this.isDark
      }
    },

    arrowIcons () {
      const ico = [
        this.prevIcon || (this.arrowsVertical === true ? this.$q.iconSet.carousel.up : this.$q.iconSet.carousel.left),
        this.nextIcon || (this.arrowsVertical === true ? this.$q.iconSet.carousel.down : this.$q.iconSet.carousel.right)
      ]

      return this.$q.lang.rtl === true
        ? ico.reverse()
        : ico
    },

    navIcon () {
      return this.navigationIcon || this.$q.iconSet.carousel.navigationIcon
    }
  },

  watch: {
    value () {
      if (this.autoplay) {
        clearInterval(this.timer)
        this.__startTimer()
      }
    },

    autoplay (val) {
      if (val) {
        this.__startTimer()
      }
      else {
        clearInterval(this.timer)
      }
    }
  },

  methods: {
    __startTimer () {
      this.timer = setTimeout(
        this.next,
        isNumber(this.autoplay) ? this.autoplay : 5000
      )
    },

    __getNavigationContainer (h, type, mapping) {
      return h('div', {
        staticClass: 'q-carousel__control q-carousel__navigation no-wrap absolute flex scroll-x q-carousel__navigation--' + type +
          ' q-carousel__navigation--' + this.navigationPosition,
        class: this.controlColor ? `text-${this.controlColor}` : null
      }, [
        h('div', {
          staticClass: 'q-carousel__navigation-inner flex no-wrap justify-center'
        }, this.__getAvailablePanels().map(mapping))
      ])
    },

    __getContent (h) {
      const node = []

      this.arrows === true && node.push(
        h(QBtn, {
          staticClass: `q-carousel__control q-carousel__prev-arrow${this.arrowsVertical === true ? '--vertical' : ''} absolute`,
          props: { size: 'lg', color: this.controlColor, icon: this.arrowIcons[0], round: true, flat: true, dense: true },
          on: cache(this, 'prev', { click: this.previous })
        }),
        h(QBtn, {
          staticClass: `q-carousel__control q-carousel__next-arrow${this.arrowsVertical === true ? '--vertical' : ''} absolute`,
          props: { size: 'lg', color: this.controlColor, icon: this.arrowIcons[1], round: true, flat: true, dense: true },
          on: cache(this, 'next', { click: this.next })
        })
      )

      if (this.navigation === true) {
        node.push(this.__getNavigationContainer(h, 'buttons', panel => {
          const name = panel.componentOptions.propsData.name

          return h(QBtn, {
            key: name,
            staticClass: 'q-carousel__navigation-icon',
            class: { 'q-carousel__navigation-icon--active': name === this.value },
            props: {
              icon: this.navIcon,
              round: true,
              flat: true,
              size: 'sm'
            },
            on: cache(this, 'nav#' + name, { click: () => { this.goTo(name) } })
          })
        }))
      }
      else if (this.thumbnails === true) {
        node.push(this.__getNavigationContainer(h, 'thumbnails', panel => {
          const slide = panel.componentOptions.propsData

          return h('img', {
            class: { 'q-carousel__thumbnail--active': slide.name === this.value },
            attrs: {
              src: slide.imgSrc
            },
            key: 'tmb#' + slide.name,
            on: cache(this, 'tmb#' + slide.name, { click: () => { this.goTo(slide.name) } })
          })
        }))
      }

      return mergeSlot(node, this, 'control')
    },

    __renderPanels (h) {
      return h('div', {
        staticClass: 'q-carousel q-panel-parent',
        style: this.style,
        class: this.classes
      }, [
        h('div', {
          staticClass: 'q-carousel__slides-container',
          directives: this.panelDirectives
        }, this.__getPanelContent(h))
      ].concat(this.__getContent(h)))
    }
  },

  mounted () {
    this.autoplay && this.__startTimer()
  },

  beforeDestroy () {
    clearInterval(this.timer)
  }
})
