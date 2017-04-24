import { current as theme } from '../../features/theme'
import { Vue } from '../../deps'
import Events from '../../features/events'
import Loading from './Loading.vue'

let
  vm,
  appIsInProgress = false,
  timeout,
  props = {}

function isActive () {
  return appIsInProgress
}

function show ({
  delay = 500,
  spinner = theme === 'ios' ? 'ios' : 'tail',
  message = false,
  spinnerSize,
  spinnerColor,
  messageColor
} = {}) {
  props.spinner = spinner
  props.message = message
  props.spinnerSize = spinnerSize
  props.spinnerColor = spinnerColor
  props.messageColor = messageColor

  if (appIsInProgress) {
    vm && vm.$forceUpdate()
    return
  }

  timeout = setTimeout(() => {
    timeout = null

    const node = document.createElement('div')
    document.body.appendChild(node)
    document.body.classList.add('with-loading')

    vm = new Vue({
      el: node,
      render: h => h(Loading, {props})
    })
  }, delay)

  appIsInProgress = true
  Events.$emit('app:loading', true)
}

function hide () {
  if (!appIsInProgress) {
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

  appIsInProgress = false
  Events.$emit('app:loading', false)
}

export default {
  isActive,
  show,
  hide
}
