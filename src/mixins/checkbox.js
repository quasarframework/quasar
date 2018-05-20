import { stopAndPrevent } from '../utils/event'
import TouchSwipe from '../directives/touch-swipe'

export default {
  directives: {
    TouchSwipe
  },
  props: {
    val: {},
    trueValue: { default: true },
    falseValue: { default: false }
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
    }
  },
  methods: {
    toggle (evt, blur = true) {
      if (this.disable || this.readonly) {
        return
      }
      evt && stopAndPrevent(evt)
      blur && this.$el.blur()

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

      this.__update(val)
    }
  }
}
