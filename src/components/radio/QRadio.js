import OptionMixin from '../../mixins/option'
import { QIcon } from '../icon'
import { stopAndPrevent } from '../../utils/event'

export default {
  name: 'QRadio',
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
      if (this.disable || this.readonly) {
        return
      }
      evt && stopAndPrevent(evt)
      blur && this.$el.blur()

      if (!this.isTrue) {
        this.__update(this.val)
      }
    },
    __getContent (h) {
      return [
        h(QIcon, {
          staticClass: 'q-radio-unchecked cursor-pointer absolute-full',
          props: {
            name: this.uncheckedIcon || this.$q.icon.radio.unchecked[process.env.THEME]
          }
        }),
        h(QIcon, {
          staticClass: 'q-radio-checked cursor-pointer absolute-full',
          props: {
            name: this.checkedIcon || this.$q.icon.radio.checked[process.env.THEME]
          }
        }),
        process.env.THEME === 'mat'
          ? h('div', { ref: 'ripple', staticClass: 'q-radial-ripple' })
          : null
      ]
    }
  },
  beforeCreate () {
    this.__kebabTag = 'q-radio'
  }
}
