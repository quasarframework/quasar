import { h, ref, nextTick } from 'vue'

import { createChildApp } from '../../install-quasar.js'
import { createGlobalNode, removeGlobalNode } from './global-nodes.js'

const ssrAPI = {
  onOk: () => ssrAPI,
  okCancel: () => ssrAPI,
  hide: () => ssrAPI,
  update: () => ssrAPI
}

export function merge (target, source) {
  for (const key in source) {
    if (key !== 'spinner' && Object(source[ key ]) === source[ key ]) {
      target[ key ] = Object(target[ key ]) !== target[ key ]
        ? {}
        : { ...target[ key ] }

      merge(target[ key ], source[ key ])
    }
    else {
      target[ key ] = source[ key ]
    }
  }
}

export default function (DefaultComponent, supportsCustomComponent, parentApp) {
  return pluginProps => {
    if (__QUASAR_SSR_SERVER__) { return ssrAPI }

    let DialogComponent, props
    const isCustom = supportsCustomComponent === true
      && pluginProps.component !== void 0

    if (isCustom === true) {
      const { component, componentProps } = pluginProps

      DialogComponent = (typeof component === 'string')
        ? parentApp.component(component)
        : component

      props = componentProps
    }
    else {
      const { class: klass, style, ...otherProps } = pluginProps

      DialogComponent = DefaultComponent
      props = otherProps
      klass !== void 0 && (otherProps.cardClass = klass)
      style !== void 0 && (otherProps.cardStyle = style)
    }

    const
      okFns = [],
      cancelFns = [],
      API = {
        onOk (fn) {
          okFns.push(fn)
          return API
        },
        onCancel (fn) {
          cancelFns.push(fn)
          return API
        },
        onDismiss (fn) {
          okFns.push(fn)
          cancelFns.push(fn)
          return API
        },
        hide () {
          if (dialogRef.value !== null) {
            dialogRef.value.hide()
          }
          return API
        },
        update (componentProps) {
          if (vm !== null) {
            if (isCustom === true) {
              Object.assign(props, componentProps)
            }
            else {
              const { class: klass, style, ...cfg } = componentProps

              klass !== void 0 && (cfg.cardClass = klass)
              style !== void 0 && (cfg.cardStyle = style)
              merge(props, cfg)
            }

            vm.$forceUpdate()
          }

          return API
        }
      }

    const el = createGlobalNode()

    let emittedOK = false

    const onOk = data => {
      emittedOK = true
      okFns.forEach(fn => { fn(data) })
    }

    const onHide = () => {
      app.unmount(el)
      removeGlobalNode(el)
      app = null
      vm = null

      if (emittedOK !== true) {
        cancelFns.forEach(fn => { fn() })
      }
    }

    const dialogRef = ref(null)

    let app = createChildApp({
      name: 'QGlobalDialog',
      setup () {
        return () => h(DialogComponent, {
          ref: dialogRef,
          ...props,
          onOk,
          onHide
        })
      }
    }, parentApp)

    let vm = app.mount(el)

    function show () {
      if (dialogRef.value.show !== void 0) {
        dialogRef.value.show()
      }
      else if ( // account for "script setup" way of declaring component
        vm.$.subTree
        && vm.$.subTree.component
        && vm.$.subTree.component.proxy
        && vm.$.subTree.component.proxy.show
      ) {
        vm.$.subTree.component.proxy.show()
      }
      else {
        console.error('[Quasar] Incorrectly defined Dialog component')
      }
    }

    if (dialogRef.value !== null) {
      show()
    }
    else if (typeof DialogComponent.__asyncLoader === 'function') {
      DialogComponent.__asyncLoader().then(() => {
        nextTick(show)
      })
    }

    return API
  }
}
