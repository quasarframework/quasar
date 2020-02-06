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

    controlColor: String,
    autoplay: [Number, Boolean],

    arrows: Boolean,
    prevIcon: String,
    nextIcon: String,

    navigation: Boolean,
    navigationPosition: {
      type: String,
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

    direction () {
      return this.vertical === true ? 'vertical' : 'horizontal'
    },

    classes () {
      return `q-carousel q-panel-parent` +
        (this.inFullscreen === true ? ' fullscreen' : '') +
        (this.isDark === true ? ' q-carousel--dark q-dark' : '') +
        (
          this.padding === true
            ? (this.arrows === true ? ` q-carousel--padding-${this.direction}` : '') +
              (this.navigation === true ? ` q-carousel--padding-${this.navigationPositionComputed}` : '')
            : ''
        )
    },

    arrowIcons () {
      const ico = [
        this.prevIcon || this.$q.iconSet.carousel[this.vertical === true ? 'up' : 'left'],
        this.nextIcon || this.$q.iconSet.carousel[this.vertical === true ? 'down' : 'right']
      ]

      return this.vertical === false && this.$q.lang.rtl === true
        ? ico.reverse()
        : ico
    },

    navIcon () {
      return this.navigationIcon || this.$q.iconSet.carousel.navigationIcon
    },

    navigationPositionComputed () {
      return this.navigationPosition || (this.vertical === true ? 'right' : 'bottom')
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
        class: 'q-carousel__control q-carousel__navigation no-wrap absolute flex' +
          ` q-carousel__navigation--${type} q-carousel__navigation--${this.navigationPositionComputed}` +
          (this.controlColor !== void 0 ? ` text-${this.controlColor}` : '')
      }, [
        h('div', {
          staticClass: 'q-carousel__navigation-inner flex no-wrap justify-center'
        }, this.__getAvailablePanels().map(mapping))
      ])
    },

    __getContent (h) {
      const node = []

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

      if (this.arrows === true) {
        node.push(
          h('div', {
            staticClass: `q-carousel__control q-carousel__arrow q-carousel__prev-arrow q-carousel__prev-arrow--${this.direction} absolute flex flex-center`
          }, [
            h(QBtn, {
              props: { size: 'lg', color: this.controlColor, icon: this.arrowIcons[0], round: true, flat: true, dense: true },
              on: cache(this, 'prev', { click: this.previous })
            })
          ]),
          h('div', {
            staticClass: `q-carousel__control q-carousel__arrow q-carousel__next-arrow q-carousel__next-arrow--${this.direction} absolute flex flex-center`
          }, [
            h(QBtn, {
              props: { size: 'lg', color: this.controlColor, icon: this.arrowIcons[1], round: true, flat: true, dense: true },
              on: cache(this, 'next', { click: this.next })
            })
          ])
        )
      }

      return mergeSlot(node, this, 'control')
    },

    __renderPanels (h) {
      return h('div', {
        style: this.style,
        class: this.classes,
        on: this.$listeners
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
