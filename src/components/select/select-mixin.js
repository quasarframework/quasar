import { QIcon } from '../icon'
import { QInputFrame } from '../input-frame'
import FrameMixin from '../input-frame/input-frame-mixin'

export default {
  components: {
    QIcon,
    QInputFrame
  },
  mixins: [FrameMixin],
  props: {
    options: {
      type: Array,
      required: true,
      validator: v => v.every(o => 'label' in o && 'value' in o)
    },
    chips: Boolean,
    bgColor: String,
    displayValue: String
  },
  data () {
    return {
      terms: '',
      focused: false
    }
  },
  computed: {
    hasChips () {
      return this.multiple && this.chips
    },
    length () {
      return this.multiple
        ? this.value.length
        : ([null, undefined, ''].includes(this.value) ? 0 : 1)
    },
    additionalLength () {
      return this.displayValue && this.displayValue.length > 0
    },
    frameColor () {
      return this.hasChips && this.inverted
        ? this.bgColor || this.color
        : this.color
    }
  }
}
