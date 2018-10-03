import Vue from 'vue'

import QBtn from '../btn/QBtn.js'
import { PanelParentMixin } from '../../mixins/panel.js'
import { isNumber } from '../../utils/is.js'

const navigationClasses = 'q-carousel__control q-carousel__navigation no-wrap justify-center'

export default Vue.extend({
  name: 'QCarousel',

  mixins: [ PanelParentMixin ],

  props: {
    height: String,
    padding: Boolean,

    transition: {
      default: 'q-transition--fade'
    },

    vertical: Boolean,

    controlColor: String,
    autoplay: [Number, Boolean],

    arrows: Boolean,
    arrowPrev: String,
    arrowNext: String,

    navigation: Boolean,
    navigationIcon: String,

    thumbnails: Boolean
  },

  computed: {
    style () {
      if (this.height) {
        return {
          height: this.height
        }
      }
    },

    classes () {
      return {
        [`q-carousel--${this.vertical ? 'vertical' : 'horizontal'}`]: true,
        'q-carousel--arrows': this.padding && this.arrows,
        'q-carousel--navigation': this.padding && this.navigation
      }
    },

    arrowIcons () {
      const ico = [
        this.arrowPrev || this.$q.icon.carousel.left,
        this.arrowNext || this.$q.icon.carousel.right
      ]

      return this.$q.i18n.rtl
        ? ico.reverse()
        : ico
    },

    navIcon () {
      return this.navigationIcon || this.$q.icon.carousel.navigationIcon
    },

    controlClass () {
      return {
        [`text-${this.controlColor}`]: this.controlColor,
        'absolute-right column scroll-y': this.vertical,
        'absolute-bottom row scroll-x': !this.vertical
      }
    }
  },

  watch: {
    autoplay: {
      handler (val) {
        this.$nextTick(() => {
          if (val) {
            this.timer = setInterval(
              this.next,
              isNumber(this.autoplay) ? this.autoplay : 5000
            )
          }
          else {
            clearInterval(this.timer)
          }
        })
      },
      immediate: true
    }
  },

  methods: {
    __getNavigation (h) {
      return h('div', {
        staticClass: navigationClasses + ' q-carousel__navigation--buttons',
        'class': this.controlClass
      }, this.__getAvailablePanels().map(panel => {
        const name = panel.componentOptions.propsData.name

        return h(QBtn, {
          key: name,
          staticClass: 'q-carousel__navigation-icon',
          'class': { 'q-carousel__navigation-icon--active': name === this.value },
          props: {
            icon: this.navIcon,
            round: true,
            flat: true,
            size: 'sm'
          },
          on: {
            click: () => { this.goTo(name) }
          }
        })
      }))
    },

    __getThumbnails (h) {
      return h('div', {
        staticClass: navigationClasses + ' q-carousel__navigation--thumbnails',
        'class': this.controlClass
      }, this.__getAvailablePanels().map(panel => {
        const slide = panel.componentOptions.propsData

        return h('img', {
          'class': { 'q-carousel__thumbnail--active': slide.name === this.value },
          attrs: {
            src: slide.imgSrc
          },
          on: {
            click: () => { this.goTo(slide.name) }
          }
        })
      }))
    },

    __getContent (h) {
      const node = []

      if (this.arrows) {
        node.push(
          h(QBtn, {
            staticClass: 'q-carousel__control q-carousel__prev-arrow absolute',
            props: { size: 'lg', color: this.controlColor, icon: this.arrowIcons[0], round: true, flat: true, dense: true },
            // directives: [{ name: 'show', value: this.canGoToPrevious }],
            on: { click: this.previous }
          }),
          h(QBtn, {
            staticClass: 'q-carousel__control q-carousel__next-arrow absolute',
            props: { size: 'lg', color: this.controlColor, icon: this.arrowIcons[1], round: true, flat: true, dense: true },
            // directives: [{ name: 'show', value: this.canGoToNext }],
            on: { click: this.next }
          })
        )
      }

      if (this.navigation) {
        node.push(this.__getNavigation(h))
      }
      else if (this.thumbnails) {
        node.push(this.__getThumbnails(h))
      }

      return node.concat(this.$slots.control)
    },

    __swipe (evt) {
      const dir = this.vertical ? 'up' : 'left'
      this.__go(evt.direction === dir ? 1 : -1)
    }
  },

  beforeDestroy () {
    clearInterval(this.timer)
  },

  render (h) {
    return h('div', {
      staticClass: 'q-carousel relative-position overflow-hidden',
      'class': this.classes
    }, [
      h('div', {
        staticClass: 'q-carousel__slides-container',
        style: this.style,
        directives: this.panelDirectives
      }, [
        this.__getPanelContent(h)
      ])
    ].concat(this.__getContent(h)))
  }
})
