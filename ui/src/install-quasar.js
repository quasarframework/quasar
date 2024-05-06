import { createApp } from 'vue'

import Platform, { isRuntimeSsrPreHydration } from './plugins/platform/Platform.js'
import Screen from './plugins/screen/Screen.js'
import Dark from './plugins/dark/Dark.js'
import Body from './plugins/private.body/Body.js'
import History from './plugins/private.history/History.js'
import Lang from './plugins/lang/Lang.js'
import IconSet from './plugins/icon-set/IconSet.js'

import { quasarKey } from './utils/private.symbols/symbols.js'
import { globalConfig, globalConfigIsFrozen, freezeGlobalConfig } from './utils/private.config/instance-config.js'
import { isObject } from './utils/is/is.js'

/**
 * If the list below changes, make sure
 * to also edit /ui/testing/specs/generators/generator.plugin.js
 * on the "autoInstalledPlugins" array
 */
const autoInstalledPlugins = [
  Platform,
  Body,
  Dark,
  Screen,
  History,
  Lang,
  IconSet
]

export function createChildApp (appCfg, parentApp) {
  const app = createApp(appCfg)

  app.config.globalProperties = parentApp.config.globalProperties

  const { reload, ...appContext } = parentApp._context
  Object.assign(app._context, appContext)

  return app
}

function installPlugins (pluginOpts, pluginList) {
  pluginList.forEach(Plugin => {
    Plugin.install(pluginOpts)
    Plugin.__installed = true
  })
}

function prepareApp (app, uiOpts, pluginOpts) {
  app.config.globalProperties.$q = pluginOpts.$q
  app.provide(quasarKey, pluginOpts.$q)

  installPlugins(pluginOpts, autoInstalledPlugins)

  uiOpts.components !== void 0 && Object.values(uiOpts.components).forEach(c => {
    if (isObject(c) === true && c.name !== void 0) {
      app.component(c.name, c)
    }
  })

  uiOpts.directives !== void 0 && Object.values(uiOpts.directives).forEach(d => {
    if (isObject(d) === true && d.name !== void 0) {
      app.directive(d.name, d)
    }
  })

  uiOpts.plugins !== void 0 && installPlugins(
    pluginOpts,
    Object.values(uiOpts.plugins).filter(
      p => typeof p.install === 'function' && autoInstalledPlugins.includes(p) === false
    )
  )

  if (isRuntimeSsrPreHydration.value === true) {
    pluginOpts.$q.onSSRHydrated = () => {
      pluginOpts.onSSRHydrated.forEach(fn => { fn() })
      pluginOpts.$q.onSSRHydrated = () => {}
    }
  }
}

export default __QUASAR_SSR_SERVER__
  ? function (parentApp, opts = {}, ssrContext) {
    const $q = {
      version: __QUASAR_VERSION__,
      config: opts.config || {}
    }

    Object.assign(ssrContext, {
      $q,
      _meta: {
        htmlAttrs: '',
        headTags: '',
        endingHeadTags: '',
        bodyClasses: '',
        bodyAttrs: 'data-server-rendered',
        bodyTags: ''
      }
    })

    if (ssrContext._modules === void 0) {
      // not OK. means the SSR build is not using @quasar/ssr-helpers,
      // but we shouldn't crash the app
      ssrContext._modules = []
    }

    if (ssrContext.onRendered === void 0) {
      // not OK. means the SSR build is not using @quasar/ssr-helpers,
      // but we shouldn't crash the app
      ssrContext.onRendered = () => {}
    }

    parentApp.config.globalProperties.ssrContext = ssrContext

    prepareApp(parentApp, opts, {
      parentApp,
      $q,
      lang: opts.lang,
      iconSet: opts.iconSet,
      ssrContext
    })
  }
  : function (parentApp, opts = {}) {
    const $q = { version: __QUASAR_VERSION__ }

    if (globalConfigIsFrozen === false) {
      if (opts.config !== void 0) {
        Object.assign(globalConfig, opts.config)
      }

      $q.config = { ...globalConfig }
      freezeGlobalConfig()
    }
    else {
      $q.config = opts.config || {}
    }

    prepareApp(parentApp, opts, {
      parentApp,
      $q,
      lang: opts.lang,
      iconSet: opts.iconSet,
      onSSRHydrated: []
    })
  }
