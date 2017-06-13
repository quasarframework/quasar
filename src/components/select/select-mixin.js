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
    frameColor: String,
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
    }
  },
  methods: {
    __toggle (value) {
      const
        model = this.value,
        index = model.indexOf(value)

      if (index > -1) {
        model.splice(index, 1)
      }
      else {
        model.push(value)
      }

      this.$emit('change', model)
    }
  }
}
