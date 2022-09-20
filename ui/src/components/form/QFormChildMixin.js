import { noop } from '../../utils/event.js'
import { formKey } from '../../utils/private/symbols.js'

// register component to parent QForm
function login (vm) {
  const $form = vm.$.provides[ formKey ]
  $form !== void 0 && vm.disable !== true && $form.bindComponent(vm)
}

// un-register component from parent QForm
function logout (vm) {
  const $form = vm.$.provides[ formKey ]
  $form !== void 0 && vm.disable !== true && $form.unbindComponent(vm)
}

export default {
  inject: {
    [ formKey ]: {
      default: noop
    }
  },

  watch: {
    disable (val) {
      const $form = this.$.provides[ formKey ]
      if ($form !== void 0) {
        if (val === true) {
          this.resetValidation()
          $form.unbindComponent(this)
        }
        else {
          $form.bindComponent(this)
        }
      }
    }
  },

  methods: {
    validate () {},
    resetValidation () {}
  },

  created () {
    login(this)
  },

  activated () {
    login(this)
  },

  deactivated () {
    logout(this)
  },

  beforeUnmount () {
    logout(this)
  }
}
