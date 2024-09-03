import { createReactivePlugin } from '../../utils/private.create/create.js'
import { injectProp } from '../../utils/private.inject-obj-prop/inject-obj-prop.js'

import materialIcons from '../../../icon-set/material-icons.js'

const Plugin = createReactivePlugin({
  iconMapFn: null,
  __qIconSet: {}
}, {
  // props: object

  set (setObject, ssrContext) {
    const def = { ...setObject }

    if (__QUASAR_SSR_SERVER__) {
      if (ssrContext === void 0) {
        console.error('SSR ERROR: second param required: IconSet.set(iconSet, ssrContext)')
        return
      }

      def.set = ssrContext.$q.iconSet.set
      Object.assign(ssrContext.$q.iconSet, def)
    }
    else {
      def.set = Plugin.set
      Object.assign(Plugin.__qIconSet, def)
    }
  },

  install ({ $q, iconSet, ssrContext }) {
    if (__QUASAR_SSR_SERVER__) {
      const initialSet = iconSet || materialIcons

      $q.iconMapFn = ssrContext.$q.config.iconMapFn || this.iconMapFn || null
      $q.iconSet = {}
      $q.iconSet.set = setObject => {
        this.set(setObject, ssrContext)
      }

      $q.iconSet.set(initialSet)

      // one-time SSR server operation
      if (
        this.props === void 0
        || this.props.name !== initialSet.name
      ) {
        this.props = { ...initialSet }
      }
    }
    else {
      if ($q.config.iconMapFn !== void 0) {
        this.iconMapFn = $q.config.iconMapFn
      }

      $q.iconSet = this.__qIconSet
      injectProp($q, 'iconMapFn', () => this.iconMapFn, val => { this.iconMapFn = val })

      if (this.__installed === true) {
        iconSet !== void 0 && this.set(iconSet)
      }
      else {
        this.props = new Proxy(this.__qIconSet, {
          get () { return Reflect.get(...arguments) },

          ownKeys (target) {
            return Reflect.ownKeys(target)
              .filter(key => key !== 'set')
          }
        })

        this.set(iconSet || materialIcons)
      }
    }
  }
})

export default Plugin
