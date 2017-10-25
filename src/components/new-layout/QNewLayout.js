import { viewport } from '../../utils/dom'
import { getScrollHeight } from '../../utils/scroll'
import { QScrollObservable, QResizeObservable, QWindowResizeObservable } from '../observables'

export default {
  name: 'q-new-layout',
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
        reveal: false,
        revealed: true,
        space: true
      },
      right: {
        size: 0,
        space: true
      },
      footer: {
        size: 0,
        reveal: false,
        revealed: true,
        space: true
      },
      left: {
        size: 0,
        space: true
      },

      scrollHeight: 0,
      scroll: {
        position: 0,
        direction: 'down'
      }
    }
  },
  watch: {
    'header.revealed' () {
      this.__animate()
    },
    'footer.revealed' () {
      this.__animate()
    },
    'left.space' () {
      this.__animate()
    },
    'right.space' () {
      this.__animate()
    }
  },
  computed: {
    fixed () {
      return {
        header: this.header.reveal || this.view.indexOf('H') > -1,
        footer: this.footer.reveal || this.view.indexOf('F') > -1,
        left: this.view.indexOf('L') > -1,
        right: this.view.indexOf('R') > -1
      }
    },
    rows () {
      const rows = this.view.toLowerCase().split(' ')
      return {
        top: rows[0].split(''),
        middle: rows[1].split(''),
        bottom: rows[2].split('')
      }
    },
    offsetTop () {
      if (!this.header.space) {
        return 0
      }
      if (this.fixed.header) {
        return this.header.revealed ? this.header.size : 0
      }
      const offset = this.header.size - this.scroll.position
      return offset > 0 ? offset : 0
    },
    offsetBottom () {
      if (!this.footer.space) {
        return 0
      }
      if (this.fixed.footer) {
        return this.footer.revealed ? this.footer.size : 0
      }
      const offset = this.height + this.scroll.position + this.footer.size - this.scrollHeight
      return offset > 0 ? offset : 0
    },
    offsetLeft () {
      if (this.left.space) {
        return this.left.size
      }
    },
    offsetRight () {
      if (this.right.space) {
        return this.right.size
      }
    }
  },
  render (h) {
    console.log('layout render')
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
