import { QSpinner } from '../components/spinner'

let
  vm,
  timeout,
  props = {}

const staticClass = 'q-loading animate-fade fullscreen column flex-center z-max'

const Loading = {
  isActive: false,

  show ({
    delay = 500,
    message = false,
    spinnerSize = 80,
    spinnerColor = 'white',
    messageColor = 'white',
    spinner = QSpinner,
    customClass = false
  } = {}) {
    props.spinner = spinner
    props.message = message
    props.spinnerSize = spinnerSize
    props.spinnerColor = spinnerColor
    props.messageColor = messageColor

    if (customClass && typeof customClass === 'string') {
      props.customClass = customClass.trim()
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
        name: 'q-loading',
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
            message
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
    }, delay)

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

  __Vue: null,
  __installed: false,
  install ({ $q, Vue }) {
    if (this.__installed) { return }
    this.__installed = true

    $q.loading = Loading
    this.__Vue = Vue
  }
}

export default Loading
