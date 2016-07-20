import $ from 'jquery'
import { Vue } from '../install'
import theme from '../theme'

const
  target = $('#quasar-app'),
  duration = 300,
  template = `
    <div class="modal hidden fullscreen flex items-center justify-center">
      <div class="modal-backdrop backdrop"></div>
      <div class="modal-content"></div>
    </div>
  `

class Modal {
  constructor (vmObject) {
    let
      vm = $.extend({}, vmObject),
      self = this

    if (!vm) {
      throw new Error('Modal needs a VM.')
    }
    if (!vm.template) {
      throw new Error('Modal needs a template.')
    }

    this.$el = $(template).appendTo(target)
    this.$backdrop = this.$el.find('> .modal-backdrop')
    this.$content = this.$el.find('> .modal-content')

    $.extend(true, vm, {
      el: self.$content[0],
      replace: false,
      methods: {
        close: () => { self.close() }
      }
    })

    this.vm = new Vue(vm)
    this.__onShowHandlers = []
    this.__onCloseHandlers = []
    this.selfDestroy = true
  }

  show (onShow) {
    if (this.$el.closest('html').length === 0) {
      throw new Error('Modal was previously destroyed. Create another one.')
    }

    if (this.minimized && this.maximized) {
      throw new Error('Modal cannot be minimized & maximized simultaneous.')
    }

    this.$content.removeClass('minimized maximized')
    if (this.minimized) {
      this.$content.addClass('minimized')
    }
    if (this.maximized) {
      this.$content.addClass('maximized')
    }

    let
      effect,
      options = {
        duration: duration,
        complete: () => {
          this.__onShowHandlers.forEach(
            (handler) => { handler() }
          )
          if (typeof onShow === 'function') {
            onShow()
          }
        }
      }

    if (this.transitionIn) {
      effect = this.transitionIn
    }
    else if (!this.minimized && (this.maximized || $(window).width() <= 600)) {
      effect = {translateX: [0, '101%']}
    }
    else {
      effect = theme === 'ios' ? 'transition.shrinkIn' : 'transition.slideUpIn'
    }

    this.$el.removeClass('hidden')
    this.$content.velocity(effect, options)
    if (!this.maximized) {
      this.$backdrop.addClass('active')
    }

    return this
  }

  close (onClose) {
    let
      effect,
      options = {
        duration: duration,
        complete: () => {
          if (this.selfDestroy) {
            this.destroy()
          }
          this.__onCloseHandlers.forEach(
            (handler) => { handler() }
          )
          if (typeof onClose === 'function') {
            onClose()
          }
        }
      }

    if (this.transitionOut) {
      effect = this.transitionOut
    }
    else if (!this.minimized && (this.maximized || $(window).width() <= 600)) {
      effect = {translateX: ['101%', 0]}
    }
    else {
      effect = theme === 'ios' ? 'transition.shrinkOut' : 'transition.slideDownOut'
    }

    console.log('here')
    window.z = this.$content

    this.$backdrop.removeClass('active')
    this.$content.velocity(effect, options)

    return this
  }

  onShow (handler) {
    this.__trigger('onShow', handler)
    return this
  }

  onClose (handler) {
    this.__trigger('onClose', handler)
    return this
  }

  __trigger (event, handler) {
    if (typeof handler !== 'function') {
      throw new Error('Modal ' + event + ' handler must be a function.')
    }

    this['__' + event + 'Handlers'].push(handler)
    return this
  }

  set (properties) {
    if (properties !== Object(properties)) {
      throw new Error('Modal.set() needs an object as parameter.')
    }

    Object.keys(properties).forEach((property) => {
      this[property] = properties[property]
    })

    return this
  }

  css (properties) {
    if (properties !== Object(properties)) {
      throw new Error('Modal.css() needs an object as parameter.')
    }

    this.$content.css(properties)
    return this
  }

  destroy () {
    if (this.vm) {
      this.vm.$destroy()
    }
    this.$el.remove()
  }
}

export default {
  create: (props) => new Modal(props)
}
