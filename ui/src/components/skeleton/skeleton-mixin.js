import uid from '../../utils/uid.js'

export default {
  props: {
    value: Boolean,
    rtl: Boolean,
    duration: {
      type: [Number, String],
      default: 2
    },
    width: {
      type: [Number, String],
      default: 400
    },
    height: {
      type: [Number, String],
      default: 110
    }
  },

  computed: {
    computedWidth () {
      return this.width
    },

    computedHeight () {
      return this.height
    },

    gradientId () {
      return 'gradient-' + uid()
    },

    clipPathId () {
      return 'clipPath-' + uid()
    },

    rect () {
      return {
        style: {
          fill: `url(#${this.gradientId})`
        },
        clipPath: `url(#${this.clipPathId})`
      }
    },

    viewBox () {
      return `0 0 ${this.computedWidth} ${this.computedHeight}`
    },

    svgStyle () {
      if (this.rtl === true) {
        return {
          transform: 'rotateY(180deg)'
        }
      }
    }
  },

  methods: {
    __renderStop (h, option) {
      return h('stop', {
        attrs: {
          offset: option.offset,
          'stop-color': option.color
        }
      }, [
        h('animate', {
          attrs: {
            attributeName: 'offset',
            values: option.values,
            dur: parseInt(this.duration, 10) + 's',
            repeatCount: 'indefinite'
          }
        })
      ])
    },

    __renderStops (h) {
      const options = [
        { offset: '0%', color: 'var(--skeleton-primary-color)', values: '-2; 1' },
        { offset: '50%', color: 'var(--skeleton-secondary-color)', values: '-1.5; 1.5' },
        { offset: '100%', color: 'var(--skeleton-primary-color)', values: '-1; 2' }
      ]
      return options.map(option => this.__renderStop(h, option))
    },

    __renderLinearGradient (h) {
      return h('linearGradient', {
        attrs: {
          id: this.gradientId
        }
      }, [
        ...this.__renderStops(h)
      ])
    },

    __renderDefaultItem (h, option) {
      return h('rect', {
        attrs: {
          x: option.x,
          y: option.y,
          rx: option.rx,
          ry: option.ry,
          width: option.width,
          height: option.height
        }
      })
    },

    __renderDefault (h) {
      const options = [
        { x: 0, y: 0, rx: 3, ry: 3, width: 350, height: 10 },
        { x: 20, y: 20, rx: 3, ry: 3, width: 320, height: 10 },
        { x: 20, y: 40, rx: 3, ry: 3, width: 270, height: 10 },
        { x: 0, y: 60, rx: 3, ry: 3, width: 350, height: 10 },
        { x: 20, y: 80, rx: 3, ry: 3, width: 300, height: 10 },
        { x: 20, y: 100, rx: 3, ry: 3, width: 180, height: 10 }
      ]
      return options.map(option => this.__renderDefaultItem(h, option))
    },

    __renderClipPath (h) {
      const slot = this.$scopedSlots.default

      return h('clipPath', {
        attrs: {
          id: this.clipPathId
        }
      }, [
        slot ? slot() : this.__renderDefault(h)
      ])
    },

    __renderDefs (h) {
      return h('defs', [
        this.__renderClipPath(h),
        this.__renderLinearGradient(h)
      ])
    },

    __renderRect (h) {
      return h('rect', {
        attrs: {
          'clip-path': this.rect.clipPath,
          x: 0,
          y: 0,
          width: this.computedWidth,
          height: this.computedHeight
        },
        style: this.rect.style
      })
    },

    __renderSvg (h) {
      return h('svg', {
        attrs: {
          viewBox: this.viewBox,
          preserveAspectRatio: 'xMidYMid meet'
        },
        style: this.svgStyle,
        on: this.$listeners
      }, [
        this.__renderRect(h),
        this.__renderDefs(h)
      ])
    }
  },

  render (h) {
    return this.__renderSvg(h)
  }
}
