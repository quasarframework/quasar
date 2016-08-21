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
    if (!userVm.el && !userVm.template) {
      throw new Error('Modal needs a template.')
    }

    let vm
    this.__customElement = typeof userVm.el !== 'undefined'

    if (this.__customElement) {
      vm = userVm
    }
    else {
      vm = Utils.extend(true, userVm)
      vm.template = `<div class="modal hidden fullscreen flex items-center justify-center">
            <div v-el:backdrop class="modal-backdrop backdrop"></div>
            <div v-el:content class="modal-content">${userVm.template}</div></div>`

      // preserve data bindings
      vm.data = userVm.data
      vm.methods = vm.methods || {}
      vm.methods.close = onClose => {
        this.close(onClose)
      }
    }

    this.vm = new Vue(vm)
    if (!this.__customElement) {
      this.vm.$mount().$appendTo(document.body)
      this.$content = this.vm.$els.content
      this.$backdrop = this.vm.$els.backdrop
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

    if (this.__customElement) {
      this.$backdrop.addEventListener('click', this.close)
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
            this.$el.classList.add('hidden')

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
      if (this.__customElement) {
        this.$backdrop.removeEventListener('click', this.close)
      }
      window.removeEventListener('popstate', this.__popstate)
      Velocity(this.$content, effect, options)
    }
    this.__modalId = ++openedModalNumber
    window.history.pushState({modalId: this.__modalId}, '')
    window.addEventListener('popstate', this.__popstate)

    // finally show it
    Velocity(this.$content, effect, options)

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
    this.vm.$destroy(!this.__customElement)
  }
}

export default {
  create (vm) {
    return new Modal(vm)
  }
}
