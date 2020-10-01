import { h, createApp } from 'vue'

import { appInstance } from '../install.js'
import { isSSR } from '../plugins/Platform.js'
import { getAppVm } from '../utils/vm.js'

const ssrAPI = {
  onOk: () => ssrAPI,
  okCancel: () => ssrAPI,
  hide: () => ssrAPI,
  update: () => ssrAPI
}

export function merge (target, source) {
  for (const key in source) {
    if (key !== 'spinner' && Object(source[key]) === source[key]) {
      target[key] = Object(target[key]) !== target[key]
        ? {}
        : { ...target[key] }

      merge(target[key], source[key])
    }
    else {
      target[key] = source[key]
    }
  }
}

export default function (DefaultComponent) {
  return ({ class: klass, style, component, ...props }) => {
    if (isSSR === true) { return ssrAPI }

    klass !== void 0 && (props.cardClass = klass)
    style !== void 0 && (props.cardStyle = style)

    const isCustom = component !== void 0
    const DialogComponent = isCustom === true
      ? component
      : DefaultComponent

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
          vm.$refs.dialog.hide()
          return API
        },
        update ({ class: klass, style, component, ...cfg }) {
          if (vm !== null) {
            klass !== void 0 && (cfg.cardClass = klass)
            style !== void 0 && (cfg.cardStyle = style)

            if (isCustom === true) {
              Object.assign(props, cfg)
            }
            else {
              merge(props, cfg)
            }

            vm.$forceUpdate()
          }

          return API
        }
      }

    const node = document.createElement('div')
    document.body.appendChild(node)

    let emittedOK = false

    const onOk = data => {
      emittedOK = true
      okFns.forEach(fn => { fn(data) })
    }

    const onHide = () => {
      app.unmount(node)
      node.remove()
      app = null
      vm = null

      if (emittedOK !== true) {
        cancelFns.forEach(fn => { fn() })
      }
    }

    let app = createApp({
      name: 'QGlobalDialog',
      render () {
        return h(DialogComponent, {
          ref: 'dialog',
          ...props,
          onOk,
          onHide
        })
      }
    })

    app.config.globalProperties = appInstance.config.globalProperties
    app.mount(node)

    let vm = getAppVm(app)
    vm.$refs.dialog.show()

    return API
  }
}
