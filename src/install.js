import './polyfills'
import { version } from '../package.json'
import Platform, { isSSR } from './plugins/platform'
import History from './history'
import I18n from './i18n'
import { clientUpdateBody } from './body'
import Icons from './icons'

export let ssrInject

export default function (_Vue, opts = {}) {
  if (this.__installed) { return }
  this.__installed = true

  const
    cfg = opts.config || {},
    $q = {
      version,
      theme: process.env.THEME
    }

  // required plugins
  Platform.install({ $q, cfg })
  History.install({ cfg })
  I18n.install({ $q, Vue: _Vue, cfg, lang: opts.i18n })
  Icons.install({ $q, Vue: _Vue, iconSet: opts.iconSet })

  if (isSSR) {
    ssrInject = $q

    _Vue.mixin({
      beforeCreate () {
        this.$q = this.$root.$options.$q
      }
    })
  }
  else {
    clientUpdateBody({ $q, cfg })
    _Vue.prototype.$q = $q
  }

  if (opts.directives) {
    Object.keys(opts.directives).forEach(key => {
      const d = opts.directives[key]
      if (d.name !== undefined && d.unbind !== void 0) {
        _Vue.directive(d.name, d)
      }
    })
  }

  if (opts.components) {
    Object.keys(opts.components).forEach(key => {
      const c = opts.components[key]
      if (c.name !== undefined && (c.render !== void 0 || c.mixins !== void 0)) {
        _Vue.component(c.name, c)
      }
    })
  }

  if (opts.plugins) {
    Object.keys(opts.plugins).forEach(key => {
      const p = opts.plugins[key]
      if (typeof p.install === 'function') {
        p.install({ $q, Vue: _Vue, cfg })
      }
    })
  }
}
