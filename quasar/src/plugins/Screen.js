import Vue from 'vue'

import { isSSR, fromSSR } from './Platform.js'
import { listenOpts } from '../utils/event.js'
import debounce from '../utils/debounce.js'

const SIZE_LIST = ['sm', 'md', 'lg', 'xl']

export default {
  width: 0,
  height: 0,

  sizes: {
    sm: 600,
    md: 1024,
    lg: 1440,
    xl: 1920
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

  install ($q, queues) {
    if (isSSR) {
      $q.screen = this
      return
    }

    let update = resized => {
      const
        w = window.innerWidth,
        h = window.innerHeight,
        s = this.sizes

      if (resized === true) {
        if (h !== this.height) {
          this.height = h
        }

        if (w === this.width) {
          return
        }
      }

      this.height = h
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
      SIZE_LIST.forEach(name => {
        if (sizes[name] !== void 0) {
          updateSizes[name] = sizes[name]
        }
      })
    }
    this.setDebounce = deb => {
      updateDebounce = deb
    }

    const start = () => {
      const style = getComputedStyle(document.body)

      // if css props available
      if (style.getPropertyValue('--q-size-sm')) {
        SIZE_LIST.forEach(name => {
          this.sizes[name] = parseInt(style.getPropertyValue(`--q-size-${name}`), 10)
        })
      }

      this.setSizes = sizes => {
        SIZE_LIST.forEach(name => {
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

      this.setDebounce(updateDebounce || 16)

      if (Object.keys(updateSizes).length > 0) {
        this.setSizes(updateSizes)
        updateSizes = {}
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
