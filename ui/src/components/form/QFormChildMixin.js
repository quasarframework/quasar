import { noop } from '../../utils/event/event.js'
import { formKey } from '../../utils/private.symbols/symbols.js'

export default {
  inject: {
    [formKey]: {
      default: noop
    }
  },

  watch: {
    disable(val) {
      const $form = this.$.provides[formKey]
      if ($form !== void 0) {
        if (val === true) {
          this.resetValidation()
          $form.unbindComponent(this)
        } else {
          $form.bindComponent(this)
        }
      }
    }
  },

  methods: {
    validate() {},
    resetValidation() {}
  },

  mounted() {
    // register to parent QForm
    if (this.disable !== true) {
      this.$.provides[formKey]?.bindComponent(this)
    }
  },

  beforeUnmount() {
    // un-register from parent QForm
    if (this.disable !== true) {
      this.$.provides[formKey]?.unbindComponent(this)
    }
  }
}
