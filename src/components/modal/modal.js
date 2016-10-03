import Utils from '../../utils'
import Platform from '../../platform'
import { Vue } from '../../install'
import { current as theme } from '../../theme'
import EscapeKey from '../../escape-key'

const duration = 300
let openedModalNumber = 0

class Modal {
  constructor (userVm) {
    if (!userVm) {
      throw new Error('Modal needs a VueModel.')
    }

    if (userVm.nodeType) {
      this.__customElement = userVm
    }
    else if (!userVm.template) {
      console.error('Error in Modal create object:', userVm)
      throw new Error('Modal needs a template.')
    }
    else if (userVm.el) {
      console.error('Error in Modal create object:', userVm)
      throw new Error('Specifying "el" property for VM in a Modal is forbidden')
    }

    let vm

    if (this.__customElement) {
      vm = {el: this.__customElement}
    }
    else {
      vm = Utils.extend(true, userVm)
      vm.template = `<div class="modal hidden fullscreen flex items-center justify-center">
            <div ref="backdrop" class="modal-backdrop backdrop"></div>
            <div ref="content" class="modal-content">${userVm.template}</div></div>`

      // preserve data bindings
      vm.data = userVm.data
      vm.methods = vm.methods || {}
      vm.methods.close = onClose => {
        this.close(onClose)
      }
    }

    this.vm = new Vue(vm)
    if (!this.__customElement) {
      document.body.appendChild(this.vm.$el)
      this.$content = this.vm.$refs.content
      this.$backdrop = this.vm.$refs.backdrop
    }
    else {
      this.$content = this.vm.$el.getElementsByClassName('modal-content')[0]
      this.$backdrop = this.vm.$el.getElementsByClassName('modal-backdrop')[0]
    }

    this.$el = this.vm.$el
    this.__onShowHandlers = []
    this.__onCloseHandlers = []
    this.selfDestroy = true
  }

  show (onShow) {
    if (this.active) {
      console.warn('Modal is already displayed')
      return
    }

    if (!this.$el.closest('body')) {
      throw new Error('Modal was previously destroyed. Create another one.')
    }

    if (this.minimized && this.maximized) {
      throw new Error('Modal cannot be minimized & maximized simultaneous.')
    }

    this.$content.classList.remove('minimized', 'maximized')
    if (this.minimized) {
      this.$content.classList.add('minimized')
    }
    if (this.maximized) {
      this.$content.classList.add('maximized')
    }

    if (this.closeWithBackdrop) {
      this.$backdrop.addEventListener('click', this.close)
    }

    document.body.classList.add('with-modal')

    let
      effect,
      options = {
        duration,
        complete: () => {
          EscapeKey.register(() => { this.close(this.onEscapeKey) })
          this.__onShowHandlers.forEach(
            handler => { handler() }
          )
          if (typeof onShow === 'function') {
            onShow()
          }
          this.active = true
        }
      }

    if (this.transitionIn) {
      effect = this.transitionIn
    }
    else if (theme === 'mat') {
      effect = 'transition.slideUpIn'
    }
    else if (!this.minimized && (this.maximized || Utils.dom.viewport().width <= 600)) {
      effect = {translateX: [0, '101%']}
    }
    else {
      effect = 'transition.shrinkIn'
    }

    this.$el.classList.remove('hidden')
    setTimeout(() => {
      [].slice.call(this.$el.getElementsByClassName('modal-scroll')).forEach(el => {
        el.scrollTop = 0
      })
    }, 10)
    if (!this.maximized) {
      this.$backdrop.classList.add('active')
    }

    this.__popstate = () => {
      if (
        !Platform.within.iframe &&
        window.history.state &&
        window.history.state.modalId &&
        window.history.state.modalId >= this.__modalId
      ) {
        return
      }
      openedModalNumber--
      this.active = false

      let
        effect,
        options = {
          duration,
          complete: () => {
            this.$el.classList.add('hidden')
            if (!openedModalNumber) {
              document.body.classList.remove('with-modal')
            }

            if (this.selfDestroy) {
              this.destroy()
            }
            if (this.__closedByBackButton && this.onBackButton) {
              this.onBackButton()
            }
            this.__onCloseHandlers.forEach(
              handler => { handler() }
            )
            if (typeof this.__onClose === 'function') {
              this.__onClose()
              delete this.__onClose
            }
          }
        }

      if (this.transitionOut) {
        effect = this.transitionOut
      }
      else if (!this.minimized && (this.maximized || Utils.dom.viewport().width <= 600)) {
        effect = theme === 'ios' ? {translateX: ['101%', 0]} : 'transition.slideDownOut'
      }
      else {
        effect = theme === 'ios' ? 'transition.shrinkOut' : 'transition.expandOut'
      }

      this.$backdrop.classList.remove('active')
      if (this.closeWithBackdrop) {
        this.$backdrop.removeEventListener('click', this.close)
      }
      if (!Platform.within.iframe) {
        window.removeEventListener('popstate', this.__popstate)
      }
      EscapeKey.pop()
      Velocity(this.$content, effect, options)
    }
    this.__modalId = ++openedModalNumber
    this.__closedByBackButton = true
    if (!Platform.within.iframe) {
      window.history.pushState({modalId: this.__modalId}, '')
      window.addEventListener('popstate', this.__popstate)
    }

    // finally show it
    Velocity(this.$content, effect, options)

    return this
  }

  close (onClose) {
    this.__onClose = onClose
    this.__closedByBackButton = false
    if (Platform.within.iframe) {
      this.__popstate()
    }
    else {
      window.history.go(-1)
    }
    return this
  }

  onShow (handler) {
    this.__registerTrigger('onShow', handler)
    return this
  }

  onClose (handler) {
    this.__registerTrigger('onClose', handler)
    return this
  }

  __registerTrigger (event, handler) {
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

    Object.keys(properties).forEach(property => {
      this[property] = properties[property]
    })

    return this
  }

  css (properties) {
    if (properties !== Object(properties)) {
      throw new Error('Modal.css() needs an object as parameter.')
    }

    Utils.dom.css(this.$content, properties)
    return this
  }

  destroy () {
    this.vm.$destroy(!this.__customElement)
  }
}

export default {
  create (vm) {
    return new Modal(vm)
  }
}
