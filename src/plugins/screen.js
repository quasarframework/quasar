import { isSSR } from './platform'
import { listenOpts } from '../utils/event'
import { debounce } from '../utils/debounce'

export default {
  width: 1024,

  sizes: {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200
  },

  lt: {
    xl: true
  },
  gt: {
    xs: true,
    sm: true,
    md: true
  },
  lg: true,

  __installed: false,
  install ({ $q, Vue }) {
    if (this.__installed) { return }
    this.__installed = true

    if (isSSR) {
      this.$q.screen = this
      this.setSizes = this.setDebounce = () => {}
      return
    }

    if (document && document.body) {
      const style = getComputedStyle(document.body)

      // if css props available
      if (style.getPropertyValue('--q-size-sm')) {
        ['sm', 'md', 'lg', 'xl'].forEach(name => {
          this.sizes[name] = parseInt(style.getPropertyValue(`--q-size-${name}`), 10)
        })
      }
    }

    let update = () => {
      const
        w = window.innerWidth,
        s = this.sizes

      if (w === this.width) {
        return
      }

      this.width = w

      this.gt.xs = w >= s.sm
      this.gt.sm = w >= s.md
      this.gt.md = w >= s.lg
      this.gt.lg = w >= s.xl
      this.lt.sm = w < s.sm
      this.lt.md = w < s.md
      this.lt.lg = w < s.lg
      this.lt.xl = w < s.xl
      this.xs = this.lt.sm
      this.sm = this.gt.xs && this.lt.md
      this.md = this.gt.sm && this.lt.lg
      this.lg = this.gt.md && this.lt.xl
      this.xl = w > s.xl
    }

    update()
    let updateEvt = debounce(update, 100)

    window.addEventListener('resize', updateEvt, listenOpts.passive)

    this.setSizes = sizes => {
      ['sm', 'md', 'lg', 'xl'].forEach(name => {
        if (sizes[name]) {
          this.sizes[name] = sizes[name]
        }
      })
      update()
    }
    this.setDebounce = delay => {
      window.removeEventListener('resize', updateEvt, listenOpts.passive)
      updateEvt = delay > 0
        ? debounce(update, delay)
        : update
      window.addEventListener('resize', updateEvt, listenOpts.passive)
    }

    Vue.util.defineReactive($q, 'screen', this)
  }
}
