import Utils from '../../utils'
import { Vue } from '../../install'
import { current as theme } from '../../theme'

const duration = 300
let openedModalNumber = 0

class Modal {
  constructor (userVm) {
    if (!userVm) {
      throw new Error('Modal needs a VueModel.')
    }
    if (!userVm.template) {
      throw new Error('Modal needs a template.')
    }

    let vm = Utils.extend(true, userVm)

    vm.template = `<div class="modal hidden fullscreen flex items-center justify-center">
          <div v-el:backdrop class="modal-backdrop backdrop"></div>
          <div v-el:content class="modal-content">${userVm.template}</div></div>`
    vm.methods = vm.methods || {}
    vm.methods.close = onClose => {
      this.close(onClose)
    }

    // preserve data bindings
    vm.data = userVm.data

    this.vm = new Vue(vm)
    this.vm.$mount().$appendTo(document.body)

    this.$el = this.vm.$el
    this.$backdrop = this.vm.$els.backdrop
    this.$content = this.vm.$els.content

    this.__onShowHandlers = []
    this.__onCloseHandlers = []
    this.selfDestroy = true
  }

  show (onShow) {
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

    let
      effect,
      options = {
        duration,
        complete: () => {
          this.__onShowHandlers.forEach(
            handler => { handler() }
          )
          if (typeof onShow === 'function') {
            onShow()
          }
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
    Velocity(this.$content, effect, options)
    if (!this.maximized) {
      this.$backdrop.classList.add('active')
    }

    this.__popstate = () => {
      if (
        window.history.state &&
        window.history.state.modalId &&
        window.history.state.modalId >= this.__modalId
      ) {
        return
      }
      openedModalNumber--

      let
        effect,
        options = {
          duration,
          complete: () => {
            if (this.selfDestroy) {
              this.destroy()
            }
            this.__onCloseHandlers.forEach(
              handler => { console.log('onCloseHandler'); handler() }
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
      window.removeEventListener('popstate', this.__popstate)
      delete this.__popstate
      Velocity(this.$content, effect, options)
    }
    this.__modalId = ++openedModalNumber
    window.history.pushState({modalId: this.__modalId}, '')
    window.addEventListener('popstate', this.__popstate)

    return this
  }

  close (onClose) {
    this.__onClose = onClose
    window.history.go(-1)
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
    this.vm.$destroy(true)
  }
}

export default {
  create (vm) {
    return new Modal(vm)
  }
}
