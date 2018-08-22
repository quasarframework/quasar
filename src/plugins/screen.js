import { isSSR, fromSSR } from './platform.js'
import { listenOpts } from '../utils/event.js'
import debounce from '../utils/debounce.js'

export default {
  width: 0,

  sizes: {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200
  },

  lt: {
    sm: true,
    md: true,
    lg: true,
    xl: true
  },
  gt: {},
  xs: true,

  setSizes () {},
  setDebounce () {},

  install ({ $q, queues, Vue }) {
    if (isSSR) {
      $q.screen = this
      return
    }

    let update = resized => {
      const
        w = window.innerWidth,
        s = this.sizes

      if (resized && w === this.width) {
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

    let updateEvt, updateSizes = {}, updateDebounce

    this.setSizes = sizes => {
      sizes.forEach(name => {
        updateSizes[name] = sizes[name]
      })
    }
    this.setDebounce = deb => {
      updateDebounce = deb
    }

    const start = () => {
      const style = getComputedStyle(document.body)

      // if css props available
      if (style.getPropertyValue('--q-size-sm')) {
        ['sm', 'md', 'lg', 'xl'].forEach(name => {
          this.sizes[name] = parseInt(style.getPropertyValue(`--q-size-${name}`), 10)
        })
      }

      this.setSizes = sizes => {
        ['sm', 'md', 'lg', 'xl'].forEach(name => {
          if (sizes[name]) {
            this.sizes[name] = sizes[name]
          }
        })
        update()
      }
      this.setDebounce = delay => {
        const fn = () => { update(true) }
        updateEvt && window.removeEventListener('resize', updateEvt, listenOpts.passive)
        updateEvt = delay > 0
          ? debounce(fn, delay)
          : fn
        window.addEventListener('resize', updateEvt, listenOpts.passive)
      }

      this.setDebounce(updateDebounce || 100)

      if (Object.keys(updateSizes).length > 0) {
        this.setSizes(updateSizes)
        updateSizes = null
      }
      else {
        update()
      }
    }

    if (fromSSR) {
      queues.takeover.push(start)
    }
    else {
      start()
    }

    Vue.util.defineReactive($q, 'screen', this)
  }
}
