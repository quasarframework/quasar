import $ from 'jquery'
import theme from './theme'
import { Vue } from './install'
import { events } from './events'

let
  vm,
  body = $('body'),
  appIsInProgress = false,
  timeout

const template = `
  <div class="fullscreen row items-center justify-center z-absolute">
    <spinner :name="spinner" color="#fff" :size="80"></spinner>
  </div>
`

function isInProgress () {
  return appIsInProgress
}

function showProgress (options = {}) {
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
  events.trigger('app:global-progress', true)
}

function hideProgress () {
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
  events.trigger('app:global-progress', false)
}

export default {
  is: {
    in: {
      global: {
        progress: isInProgress
      }
    }
  },
  show: {
    global: {
      progress: showProgress
    }
  },
  hide: {
    global: {
      progress: hideProgress
    }
  }
}
