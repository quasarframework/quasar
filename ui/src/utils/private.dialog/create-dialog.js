import { h, ref, nextTick } from 'vue'

import { createChildApp } from '../../install-quasar.js'
import { createGlobalNode, removeGlobalNode } from '../private.config/nodes.js'

const ssrAPI = {
  onOk: () => ssrAPI,
  onCancel: () => ssrAPI,
  onDismiss: () => ssrAPI,
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

      props = componentProps || {}
    }
    else {
      const { class: klass, style, ...otherProps } = pluginProps

      DialogComponent = DefaultComponent
      props = otherProps
      klass !== void 0 && (otherProps.cardClass = klass)
      style !== void 0 && (otherProps.cardStyle = style)
    }

    let vm, emittedOK = false
    const dialogRef = ref(null)
    const el = createGlobalNode(false, 'dialog')

    const applyState = cmd => {
      if (dialogRef.value !== null && dialogRef.value[ cmd ] !== void 0) {
        dialogRef.value[ cmd ]()
        return
      }

      const target = vm.$.subTree

      if (target && target.component) {
        // account for "script setup" way of declaring component
        if (target.component.proxy && target.component.proxy[ cmd ]) {
          target.component.proxy[ cmd ]()
          return
        }

        // account for "script setup" + async component way of declaring component
        if (
          target.component.subTree
          && target.component.subTree.component
          && target.component.subTree.component.proxy
          && target.component.subTree.component.proxy[ cmd ]
        ) {
          target.component.subTree.component.proxy[ cmd ]()
          return
        }
      }

      console.error('[Quasar] Incorrectly defined Dialog component')
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
          applyState('hide')
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

    let app = createChildApp({
      name: 'QGlobalDialog',
      setup: () => () => h(DialogComponent, {
        ...props,
        ref: dialogRef,
        onOk,
        onHide,
        onVnodeMounted (...args) {
          if (typeof props.onVnodeMounted === 'function') {
            props.onVnodeMounted(...args)
          }

          nextTick(() => applyState('show'))
        }
      })
    }, parentApp)

    vm = app.mount(el)

    return API
  }
}
