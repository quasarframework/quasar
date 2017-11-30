import { viewport } from '../../utils/dom'
import { getScrollHeight } from '../../utils/scroll'
import { QScrollObservable, QResizeObservable, QWindowResizeObservable } from '../observables'

export default {
  name: 'q-layout',
  provide () {
    return {
      layout: this
    }
  },
  props: {
    view: {
      type: String,
      default: 'hhh lpr fff',
      validator: v => /^(h|l)h(h|r) lpr (f|l)f(f|r)$/.test(v.toLowerCase())
    }
  },
  data () {
    const { height, width } = viewport()

    return {
      height, // window height
      width, // window width

      header: {
        size: 0,
        offset: 0,
        space: true
      },
      right: {
        size: 300,
        offset: 0,
        space: false
      },
      footer: {
        size: 0,
        offset: 0,
        space: true
      },
      left: {
        size: 300,
        offset: 0,
        space: false
      },

      scrollHeight: 0,
      scroll: {
        position: 0,
        direction: 'down'
      }
    }
  },
  computed: {
    rows () {
      const rows = this.view.toLowerCase().split(' ')
      return {
        top: rows[0].split(''),
        middle: rows[1].split(''),
        bottom: rows[2].split('')
      }
    }
  },
  render (h) {
    return h('div', { staticClass: 'q-layout' }, [
      h(QScrollObservable, {
        on: { scroll: this.__onPageScroll }
      }),
      h(QResizeObservable, {
        on: { resize: this.__onLayoutResize }
      }),
      h(QWindowResizeObservable, {
        on: { resize: this.__onWindowResize }
      }),
      this.$slots.default
    ])
  },
  methods: {
    __animate () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      else {
        document.body.classList.add('q-layout-animate')
      }
      this.timer = setTimeout(() => {
        document.body.classList.remove('q-layout-animate')
        this.timer = null
      }, 150)
    },
    __onPageScroll (data) {
      this.scroll = data
      this.$emit('scroll', data)
    },
    __onLayoutResize () {
      this.scrollHeight = getScrollHeight(this.$el)
      this.$emit('scrollHeight', this.scrollHeight)
    },
    __onWindowResize ({ height, width }) {
      if (this.height !== height) {
        this.height = height
      }
      if (this.width !== width) {
        this.width = width
      }
    }
  }
}
