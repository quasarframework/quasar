import { isSSR, fromSSR } from './platform'
import { listenOpts } from '../utils/event'
import { debounce } from '../utils/debounce'
import { $q, queues } from '../install'

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
    xl: true
  },
  gt: {},
  xs: true,

  setSizes () {},
  setDebounce () {},

  install ({ Vue }) {
    if (isSSR) {
      $q.screen = this
      return
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

    let
      updateEvt = debounce(update, 100),
      updateSizes = {},
      updateDebounce

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
        window.removeEventListener('resize', updateEvt, listenOpts.passive)
        updateEvt = delay > 0
          ? debounce(update, delay)
          : update
        window.addEventListener('resize', updateEvt, listenOpts.passive)
      }

      updateDebounce && this.setDebounce(updateDebounce)
      Object.keys(updateSizes).length > 0 && this.setSizes(updateSizes)
      update()

      window.addEventListener('resize', updateEvt, listenOpts.passive)
    }

    Vue.util.defineReactive($q, 'screen', this)

    if (fromSSR) {
      queues.takeover.push(start)
    }
    else {
      start()
    }
  }
}
