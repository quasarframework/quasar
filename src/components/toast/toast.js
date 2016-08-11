import Utils from '../../utils'
import { Vue } from '../../install'
import Events from '../../events'

document.body.innerHTML += '<div id="__quasar_toasts" class="column"></div>'

let
  toastNode = document.getElementById('__quasar_toasts'),
  dismissers = [],
  types = [
    {
      name: 'positive',
      defaults: {icon: 'check', color: 'positive'}
    },
    {
      name: 'negative',
      defaults: {icon: 'whatshot', color: 'negative'}
    },
    {
      name: 'info',
      defaults: {icon: 'info', color: 'info'}
    },
    {
      name: 'warning',
      defaults: {icon: 'warning', color: 'warning'}
    }
  ]

function dismissAll () {
  dismissers.forEach(dismiss => { dismiss() })
}

class Toast {
  constructor (options) {
    let
      dismiss = () => { this.dismiss(true) },
      color = options.color ? 'custom-background bg-' + options.color : ''

    this.timeout = typeof options.timeout !== 'undefined' ? options.timeout : 7000
    this.onDismiss = options.onDismiss || function () {}

    this.vm = new Vue({
      template: `<div
        class="quasar-toast row items-center justify-between nowrap non-selectable ${color}"
        v-touch:pan="pan"
        v-touch-options:pan="{ direction: 'horizontal' }">` +
        (options.icon ? `<i>${options.icon}</i>` : '') +
        (options.image ? `<img src="${options.image}">` : '') +
        `<div class="auto">${options.html}</div>` +
        (options.button ? `<a @click="toastButton">${options.button.label}</a>` : '') +
        '<a @click="dismissAll" class="quasar-toast-dismiss-all"><i>delete</i></a></div>',
      methods: {
        pan (event) {
          var
            delta = event.deltaX,
            opacity = 0.9 - Math.abs(delta) / 180

          Velocity(this.$el, 'stop')

          if (opacity < 0.05) {
            this.$el.style.opacity = '0'
            dismiss()
            return
          }

          if (event.isFinal) {
            Velocity(this.$el, {
              translateX: [0, delta],
              opacity: 0.9
            })
            return
          }

          Utils.dom.css(this.$el, {
            transform: 'translateX(' + delta + 'px)',
            opacity: opacity
          })
        },
        dismissAll: dismissAll,
        toastButton: () => {
          this.dismiss()
          if (options.button && typeof options.button.handler === 'function') {
            options.button.handler()
          }
        }
      }
    })
    this.vm.$mount().$appendTo(toastNode)

    if (this.timeout > 0) {
      this.timer = setTimeout(() => {
        this.dismiss()
      }, this.timeout)
    }

    Events.trigger('app:toast', this.html)
    Velocity(this.vm.$el, 'slideDown', {
      easing: 'easeOutQuart',
      display: 'flex'
    })

    if (dismissers.length > 5) {
      dismissers.shift()()
    }
    dismissers.push(() => { this.dismiss() })

    return {
      node: this.node,
      dismiss: this.dismiss.bind(this)
    }
  }

  dismiss (swipedOut) {
    if (this.dismissed) {
      return
    }

    this.dismissed = true

    if (this.timer) {
      clearTimeout(this.timer)
    }

    if (swipedOut) {
      this.vm.$destroy(true)
      this.onDismiss()
    }
    else {
      Velocity(this.vm.$el, 'slideUp', {
        complete: () => {
          this.vm.$destroy(true)
          this.onDismiss()
        }
      })
    }

    dismissers = dismissers.filter(item => item !== this.dismiss)
  }
}

function create (opts, defaults) {
  if (!opts) {
    throw new Error('Missing toast options.')
  }

  let options = Utils.extend(
    true,
    typeof opts === 'string' ? {html: opts} : opts,
    defaults
  )

  if (!options.html) {
    throw new Error('Missing toast content/HTML.')
  }

  return new Toast(options)
}

types.forEach(type => {
  create[type.name] = opts => create(opts, type.defaults)
})

export default {
  create
}
