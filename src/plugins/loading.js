import { QSpinner } from '../components/spinner'
import { isSSR } from './platform'
import { $q } from '../install'

let
  vm,
  timeout,
  props = {},
  defaults = {
    delay: 500,
    message: false,
    spinnerSize: 80,
    spinnerColor: 'white',
    messageColor: 'white',
    spinner: QSpinner,
    customClass: false
  }

const staticClass = 'q-loading animate-fade fullscreen column flex-center z-max'

export default {
  isActive: false,

  show (opts) {
    if (isSSR) { return }

    props = Object.assign({}, defaults, opts)

    if (typeof props.customClass === 'string') {
      props.customClass = props.customClass.trim()
    }

    if (this.isActive) {
      vm && vm.$forceUpdate()
      return
    }

    timeout = setTimeout(() => {
      timeout = null

      const node = document.createElement('div')
      document.body.appendChild(node)
      document.body.classList.add('with-loading')

      vm = new this.__Vue({
        name: 'QLoading',
        el: node,
        render (h) {
          return h('div', {
            staticClass,
            'class': props.customClass
          }, [
            h(props.spinner, {
              props: {
                color: props.spinnerColor,
                size: props.spinnerSize
              }
            }),
            props.message
              ? h('div', {
                'class': `text-${props.messageColor}`,
                domProps: {
                  innerHTML: props.message
                }
              })
              : null
          ])
        }
      })
    }, props.delay)

    this.isActive = true
  },
  hide () {
    if (!this.isActive) {
      return
    }

    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    else {
      vm.$destroy()
      document.body.classList.remove('with-loading')
      document.body.removeChild(vm.$el)
      vm = null
    }

    this.isActive = false
  },
  setDefaults (opts) {
    Object.assign(defaults, opts)
  },

  __Vue: null,
  install ({ Vue, cfg: { loading } }) {
    loading && this.setDefaults(loading)

    $q.loading = this
    this.__Vue = Vue
  }
}
