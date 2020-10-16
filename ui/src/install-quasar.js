import { version } from '../package.json'
import Platform from './plugins/Platform.js'
import Screen from './plugins/Screen.js'
import Dark from './plugins/Dark.js'
import History from './history.js'
import Lang from './lang.js'
import Body from './body.js'
import IconSet from './icon-set.js'

const autoInstalled = [
  Platform, Screen, Dark
]

export const queues = {
  server: [], // on SSR update
  takeover: [] // on client takeover
}

export const $q = {
  version,
  config: {}
}

// to be used by client-side only
export let appInstance

export default function (app, opts = {}, ssrContext) {
  if (__QUASAR_SSR_SERVER__) {
    if (this.__qInstalled !== true) {
      $q.config = Object.freeze(opts.config || {})
    }

    Object.assign(ssrContext._meta, {
      htmlAttrs: '',
      headTags: '',
      bodyClasses: '',
      bodyAttrs: 'data-server-rendered'
    })

    app.config.globalProperties.ssrContext = ssrContext
  }
  else {
    if (this.__qInstalled === true) {
      return
    }

    appInstance = app
    $q.config = Object.freeze(opts.config || {})
  }

  app.config.globalProperties.$q = $q

  const cfg = $q.config

  // required plugins
  Platform.install($q, queues)
  Body.install(queues, cfg)
  Dark.install($q, queues, cfg)
  Screen.install($q, queues, cfg)
  History.install(cfg)
  Lang.install($q, queues, opts.lang)
  IconSet.install($q, queues, opts.iconSet)

  opts.components && Object.keys(opts.components).forEach(key => {
    const c = opts.components[key]
    if (Object(c) === c && c.name !== void 0) {
      app.component(c.name, c)
    }
  })

  opts.directives && Object.keys(opts.directives).forEach(key => {
    const d = opts.directives[key]
    if (Object(d) === d && d.name !== void 0) {
      app.directive(d.name, d)
    }
  })

  if (opts.plugins && (__QUASAR_SSR_SERVER__ !== true || this.__qInstalled !== true)) {
    const param = { app, $q, queues, cfg }
    Object.keys(opts.plugins).forEach(key => {
      const p = opts.plugins[key]
      if (typeof p.install === 'function' && autoInstalled.includes(p) === false) {
        p.install(param)
      }
    })
  }

  this.__qInstalled = true
}
