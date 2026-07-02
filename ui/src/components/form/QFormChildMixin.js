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
        if (val) {
          this.resetValidation()
          $form.unbindComponent(this)
        } else {
          $form.bindComponent(this)
        }
      }
    }
  },

  methods: {
    /**
     * Needs to be overwritten when getting extended/mixed in
     *
     * @api method validate
     * @returns {Boolean|Promise<boolean>} Promise is always fulfilled and receives the outcome (true -> validation was a success, false -> invalid models detected)
     */
    validate() {},
    /**
     * Needs to be overwritten when getting extended/mixed in
     *
     * @api method resetValidation
     */
    resetValidation() {}
  },

  mounted() {
    // register to parent QForm
    if (!this.disable) {
      this.$.provides[formKey]?.bindComponent(this)
    }
  },

  beforeUnmount() {
    // un-register from parent QForm
    if (!this.disable) {
      this.$.provides[formKey]?.unbindComponent(this)
    }
  }
}
