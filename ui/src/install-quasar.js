import { createApp } from 'vue'

import Platform from './plugins/Platform.js'
import Screen from './plugins/Screen.js'
import Dark from './plugins/Dark.js'
import History from './history.js'
import Lang from './lang.js'
import Body from './body.js'
import IconSet from './icon-set.js'

import { quasarKey } from './utils/private/symbols.js'

const autoInstalled = [
  Platform, Screen, Dark
]

// to be used by client-side only
export let $q
export let appInstance

export function createChildApp (appCfg) {
  const app = createApp(appCfg)

  app.config.globalProperties = appInstance.config.globalProperties

  const { reload, ...appContext } = appInstance._context
  Object.assign(app._context, appContext)

  return app
}

// to be used by SSR client-side only
const onSSRHydrated = []

function prepareApp (app, uiOpts, pluginOpts) {
  app.config.globalProperties.$q = pluginOpts.$q
  app.provide(quasarKey, pluginOpts.$q)

  Platform.install(pluginOpts)
  Body.install(pluginOpts)
  Dark.install(pluginOpts)
  Screen.install(pluginOpts)
  History.install(pluginOpts)
  Lang.install(pluginOpts)
  IconSet.install(pluginOpts)

  uiOpts.components !== void 0 && Object.keys(uiOpts.components).forEach(key => {
    const c = uiOpts.components[ key ]
    if (Object(c) === c && c.name !== void 0) {
      app.component(c.name, c)
    }
  })

  uiOpts.directives !== void 0 && Object.keys(uiOpts.directives).forEach(key => {
    const d = uiOpts.directives[ key ]
    if (Object(d) === d && d.name !== void 0) {
      app.directive(d.name, d)
    }
  })

  uiOpts.plugins !== void 0 && Object.keys(uiOpts.plugins).forEach(key => {
    const p = uiOpts.plugins[ key ]
    if (typeof p.install === 'function' && autoInstalled.includes(p) === false) {
      p.install(pluginOpts)
    }
  })
}

const installQuasar = __QUASAR_SSR_SERVER__
  ? function (app, opts = {}, ssrContext) {
      const $q = {
        version: __QUASAR_VERSION__,
        config: Object.freeze(opts.config || {})
      }

      ssrContext.$q = $q

      Object.assign(ssrContext._meta, {
        htmlAttrs: '',
        headTags: '',
        bodyClasses: '',
        bodyAttrs: 'data-server-rendered',
        bodyTags: ''
      })

      app.config.globalProperties.ssrContext = ssrContext

      prepareApp(app, opts, {
        app,
        $q,
        cfg: $q.config,
        lang: opts.lang,
        iconSet: opts.iconSet,
        ssrContext
      })
    }
  : function (app, opts = {}) {
    if (this.__qInstalled === true) { return }
    this.__qInstalled = true

    appInstance = app

    $q = {
      version: __QUASAR_VERSION__,
      config: Object.freeze(opts.config || {})
    }

    prepareApp(app, opts, {
      app,
      $q,
      cfg: $q.config,
      lang: opts.lang,
      iconSet: opts.iconSet,
      onSSRHydrated
    })
  }

export default installQuasar
