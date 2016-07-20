import $ from 'jquery'
import { Vue } from './install'
import { events } from './events'

let
  notifyNode = $('<div id="__quasar_notifiers" class="column">'),
  dismissers = [],
  types = [
    {
      name: 'positive',
      defaults: {icon: 'check'}
    },
    {
      name: 'negative',
      defaults: {icon: 'whatshot'}
    },
    {
      name: 'info',
      defaults: {icon: 'info'}
    },
    {
      name: 'warning',
      defaults: {icon: 'warning'}
    }
  ]

$('body').append(notifyNode)

function dismissAll () {
  dismissers.forEach((dismiss) => { dismiss() })
}

class Notify {
  constructor (options) {
    var dismiss = () => { this.dismiss() }

    $.extend(true,
      this,
      {
        timeout: 7000,
        onDismiss: options.onDismiss || $.noop,
        vm: {
          methods: {
            ____pan: function (event) {
              var
                el = $(this.$el),
                delta = event.deltaX,
                opacity = 0.9 - Math.abs(delta) / 180

              el.velocity('stop')

              if (opacity < 0.05) {
                el.css('opacity', '0')
                dismiss()
                return
              }

              if (event.isFinal) {
                el.velocity({
                  translateX: [0, delta],
                  opacity: 0.9
                })
                return
              }

              el.css({
                transform: 'translateX(' + delta + 'px)',
                opacity: opacity
              })
            }
          }
        }
      },
      options
    )

    this.node = $(`
      <div
        class="quasar-notifier row items-center justify-between nowrap non-selectable"
        v-touch:pan="____pan"
        v-touch-options:pan="{ direction: 'horizontal' }">
      >
    `)

    this.node.append(
      (this.icon ? `<i>${this.icon}</i>` : '') +
      (this.image ? `<img src="${this.image}">` : '') +
      `<div class="auto">${this.html}</div>`
    )

    if (this.button) {
      let button = $(`<a>${this.button.label}</a>`)

      this.node.append(button)
      button.click(() => {
        this.dismiss()
        if (typeof this.button.handler === 'function') {
          this.button.handler()
        }
      })
    }

    $('<a class="quasar-notifier-dismiss-all"><i>delete</i></a>')
      .click(dismissAll)
      .appendTo(this.node)

    if (this.timeout > 0) {
      this.timer = setTimeout(() => {
        this.dismiss()
      }, this.timeout)
    }

    this.vm.el = this.node[0]
    this.vm = new Vue(this.vm)

    events.trigger('app:notify', this.html)
    this.node.css('display', 'none').appendTo(notifyNode).slideToggle()

    if (dismissers.length > 5) {
      dismissers.shift()()
    }
    dismissers.push(this.dismiss)

    return {
      node: this.node,
      dismiss: this.dismiss.bind(this),
      vm: this.vm
    }
  }

  dismiss () {
    if (this.dismissed) {
      return
    }

    if (this.timer) {
      clearTimeout(this.timer)
    }

    this.node.slideToggle(200, () => {
      this.vm.$destroy(true)
      this.onDismiss()
    })

    this.dismissed = true

    dismissers = dismissers.filter((item) => {
      return item !== this.dismiss
    })
  }
}

function create (options, defaults) {
  if (!options) {
    throw new Error('Missing notify options.')
  }

  if (typeof options === 'string') {
    options = {html: options}
  }

  $.extend(true, options, defaults)

  if (!options.html) {
    throw new Error('Missing notify content/HTML.')
  }

  return new Notify(options)
}

types.forEach((type) => {
  create[type.name] = (opts) => create(opts, type.defaults)
})

export default {
  create
}
