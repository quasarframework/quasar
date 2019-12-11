import DarkMixin from './dark.js'
import { stopAndPrevent } from '../utils/event.js'

export default {
  mixins: [ DarkMixin ],

  props: {
    value: {
      required: true
    },
    val: {},

    trueValue: { default: true },
    falseValue: { default: false },

    label: String,
    leftLabel: Boolean,

    color: String,
    keepColor: Boolean,
    dense: Boolean,

    disable: Boolean,
    tabindex: [String, Number]
  },

  computed: {
    isTrue () {
      return this.modelIsArray
        ? this.index > -1
        : this.value === this.trueValue
    },

    isFalse () {
      return this.modelIsArray
        ? this.index === -1
        : this.value === this.falseValue
    },

    index () {
      if (this.modelIsArray === true) {
        return this.value.indexOf(this.val)
      }
    },

    modelIsArray () {
      return this.val !== void 0 && Array.isArray(this.value)
    },

    computedTabindex () {
      return this.disable === true ? -1 : this.tabindex || 0
    }
  },

  methods: {
    toggle (e) {
      e !== void 0 && stopAndPrevent(e)

      if (this.disable === true) {
        return
      }

      let val

      if (this.modelIsArray === true) {
        if (this.isTrue === true) {
          val = this.value.slice()
          val.splice(this.index, 1)
        }
        else {
          val = this.value.concat([ this.val ])
        }
      }
      else if (this.isTrue === true) {
        val = this.toggleIndeterminate === true
          ? this.indeterminateValue
          : this.falseValue
      }
      else if (this.isFalse === true) {
        val = this.trueValue
      }
      else {
        val = this.falseValue
      }

      this.$emit('input', val)
    },

    __onKeydown (e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        stopAndPrevent(e)
      }
    },

    __onKeyup (e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        this.toggle(e)
      }
    }
  }
}
