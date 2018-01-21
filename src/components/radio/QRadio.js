import OptionMixin from '../../mixins/option'
import { QIcon } from '../icon'
import { stopAndPrevent } from '../../utils/event'

export default {
  name: 'q-radio',
  mixins: [OptionMixin],
  props: {
    val: {
      required: true
    }
  },
  computed: {
    isTrue () {
      return this.value === this.val
    }
  },
  methods: {
    toggle (evt, blur = true) {
      if (this.disable) {
        return
      }
      if (evt) {
        stopAndPrevent(evt)
      }
      if (blur) {
        this.$el.blur()
      }

      if (!this.isTrue) {
        this.__update(this.val)
      }
    },
    __getContent (h) {
      return [
        h(QIcon, {
          staticClass: 'q-radio-unchecked cursor-pointer absolute-full',
          props: {
            name: this.uncheckedIcon || this.$q.icon.radio.unchecked[__THEME__]
          }
        }),
        h(QIcon, {
          staticClass: 'q-radio-checked cursor-pointer absolute-full',
          props: {
            name: this.checkedIcon || this.$q.icon.radio.checked[__THEME__]
          }
        }),
        __THEME__ === 'mat'
          ? h('div', { ref: 'ripple', staticClass: 'q-radial-ripple' })
          : null
      ]
    }
  }
}
