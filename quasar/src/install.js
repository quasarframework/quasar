import './polyfills.js'
import { version } from '../package.json'
import Platform, { isSSR } from './plugins/Platform.js'
import Screen from './plugins/Screen.js'
import History from './history.js'
import Lang from './lang.js'
import Body from './body.js'
import Icons from './icons.js'

export const queues = {
  server: [], // on SSR update
  takeover: [] // on client takeover
}

export const $q = {
  version
}

export default function (Vue, opts = {}) {
  if (this.__installed) { return }
  this.__installed = true

  const cfg = opts.config || {}

  // required plugins
  Platform.install($q, queues)
  Body.install($q, queues, cfg)
  Screen.install($q, queues)
  History.install($q, cfg)
  Lang.install($q, queues, opts.lang)
  Icons.install($q, opts.iconSet)

  if (isSSR) {
    Vue.mixin({
      beforeCreate () {
        this.$q = this.$root.$options.$q
      }
    })
  }
  else {
    Vue.prototype.$q = $q
  }

  opts.components && Object.keys(opts.components).forEach(key => {
    const c = opts.components[key]
    if (typeof c === 'function') {
      Vue.component(c.options.name, c)
    }
  })

  opts.directives && Object.keys(opts.directives).forEach(key => {
    const d = opts.directives[key]
    if (d.name !== undefined && d.unbind !== void 0) {
      Vue.directive(d.name, d)
    }
  })

  if (opts.plugins) {
    const param = { $q, queues, cfg }
    Object.keys(opts.plugins).forEach(key => {
      const p = opts.plugins[key]
      if (typeof p.install === 'function' && p !== Platform && p !== Screen) {
        p.install(param)
      }
    })
  }
}
