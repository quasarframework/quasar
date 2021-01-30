import { noop } from '../../utils/event.js'
import { formKey } from '../../utils/private/symbols.js'

export default {
  inject: {
    [ formKey ]: {
      default: noop
    }
  },

  methods: {
    validate () {}
  },

  created () {
    const $form = this.$.provides[ formKey ]
    $form !== void 0 && $form.bindComponent(this)
  },

  beforeUnmount () {
    const $form = this.$.provides[ formKey ]
    $form !== void 0 && $form.unbindComponent(this)
  }
}
