import $ from 'jquery'
import { current as theme } from './theme'
import { Vue } from './install'
import Events from './events'

let
  vm,
  appIsInProgress = false,
  timeout

const
  body = $('body'),
  template = `
    <div class="fullscreen row items-center justify-center z-absolute">
      <spinner :name="spinner" color="#fff" :size="80"></spinner>
    </div>
  `

function isActive () {
  return appIsInProgress
}

function show (options = {}) {
  if (appIsInProgress) {
    return
  }

  timeout = setTimeout(function () {
    var node = $(template)

    body.addClass('dimmed')
    body.append(node)

    vm = new Vue({
      el: node[0],
      data: {
        spinner: options.spinner || theme === 'ios' ? 'ios' : 'tail'
      }
    })

    timeout = null
  }, options.delay || 500)

  appIsInProgress = true
  Events.trigger('app:loading', true)
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
    body.removeClass('dimmed')
    vm.$destroy(true)
  }

  appIsInProgress = false
  Events.trigger('app:loading', false)
}

export default {
  isActive,
  show,
  hide
}
