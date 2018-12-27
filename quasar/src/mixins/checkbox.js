import { stopAndPrevent } from '../utils/event.js'

export default {
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
    dark: Boolean,
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
      if (this.modelIsArray) {
        return this.value.indexOf(this.val)
      }
    },

    modelIsArray () {
      return Array.isArray(this.value)
    },

    computedTabindex () {
      return this.disable ? -1 : this.tabindex || 0
    }
  },

  methods: {
    toggle () {
      if (this.disable === true) {
        return
      }

      let val

      if (this.modelIsArray) {
        if (this.isTrue) {
          val = this.value.slice()
          val.splice(this.index, 1)
        }
        else {
          val = this.value.concat(this.val)
        }
      }
      else if (this.isTrue) {
        val = this.toggleIndeterminate ? this.indeterminateValue : this.falseValue
      }
      else if (this.isFalse) {
        val = this.trueValue
      }
      else {
        val = this.falseValue
      }

      this.$emit('input', val)
    },

    __keyDown (e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        stopAndPrevent(e)
        this.toggle()
      }
    }
  }
}
