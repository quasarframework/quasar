import { h, nextTick, ref } from 'vue'

import { createChildApp } from '../../install-quasar.js'
import { createGlobalNode, removeGlobalNode } from '../private.config/nodes.js'

const ssrAPI = {
  onOk: () => ssrAPI,
  onCancel: () => ssrAPI,
  onDismiss: () => ssrAPI,
  hide: () => ssrAPI,
  update: () => ssrAPI
}

export function merge(target, source) {
  for (const key in source) {
    if (
      key !== 'spinner' &&
      Object(source[key]) === source[key] &&
      !Array.isArray(source[key])
    ) {
      target[key] =
        Object(target[key]) !== target[key] ? {} : { ...target[key] }

      merge(target[key], source[key])
    } else {
      target[key] = source[key]
    }
  }
}

export function createDialog(
  DefaultComponent,
  supportsCustomComponent,
  parentApp
) {
  return pluginProps => {
    if (__QUASAR_SSR_SERVER__) return ssrAPI

    let DialogComponent, props
    const isCustom = supportsCustomComponent && pluginProps.component !== void 0

    if (isCustom) {
      const { component, componentProps } = pluginProps

      DialogComponent =
        typeof component === 'string'
          ? parentApp.component(component)
          : component

      props = componentProps || {}
    } else {
      const { class: klass, style, ...otherProps } = pluginProps

      DialogComponent = DefaultComponent
      props = otherProps
      if (klass !== void 0) otherProps.cardClass = klass
      if (style !== void 0) otherProps.cardStyle = style
    }

    let vm
    let emittedOK = false
    const dialogRef = ref(null)
    const el = createGlobalNode(false, 'dialog')

    const applyState = cmd => {
      if (dialogRef.value?.[cmd] !== void 0) {
        dialogRef.value[cmd]()
        return
      }

      // account for "script setup" way of declaring the component,
      // where the QDialog can sit behind any number of (possibly async)
      // single-root wrapper components; non-function cmd matches on
      // intermediate wrappers (e.g. a "show" prop) must not stop the walk
      let target = vm.$.subTree?.component

      while (target) {
        if (typeof target.proxy?.[cmd] === 'function') {
          target.proxy[cmd]()
          return
        }

        target = target.subTree?.component
      }

      console.error('[Quasar] Incorrectly defined Dialog component')
    }

    const okFns = [],
      cancelFns = [],
      API = {
        onOk(fn) {
          okFns.push(fn)
          return API
        },
        onCancel(fn) {
          cancelFns.push(fn)
          return API
        },
        onDismiss(fn) {
          okFns.push(fn)
          cancelFns.push(fn)
          return API
        },
        hide() {
          applyState('hide')
          return API
        },
        update(componentProps) {
          if (vm !== null) {
            if (isCustom) {
              Object.assign(props, componentProps)
            } else {
              const { class: klass, style, ...cfg } = componentProps

              if (klass !== void 0) cfg.cardClass = klass
              if (style !== void 0) cfg.cardStyle = style
              merge(props, cfg)
            }

            vm.$forceUpdate()
          }

          return API
        }
      }

    const onOk = data => {
      emittedOK = true
      okFns.forEach(fn => {
        fn(data)
      })
    }

    const onHide = reason => {
      app.unmount(el)
      removeGlobalNode(el)
      app = null
      vm = null

      if (!emittedOK) {
        cancelFns.forEach(fn => {
          fn(reason)
        })
      }
    }

    let app = createChildApp(
      {
        name: 'QGlobalDialog',
        setup: () => () =>
          h(DialogComponent, {
            ...props,
            ref: dialogRef,
            onOk,
            onHide,
            onVnodeMounted(...args) {
              if (typeof props.onVnodeMounted === 'function') {
                props.onVnodeMounted(...args)
              }

              nextTick(() => applyState('show'))
            }
          })
      },
      parentApp
    )

    vm = app.mount(el)

    return API
  }
}
