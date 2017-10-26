import { QIcon } from '../components/icon'
import { QInputFrame } from '../components/input-frame'
import { QChip } from '../components/chip'
import FrameMixin from './input-frame'

export default {
  components: {
    QIcon,
    QInputFrame,
    QChip
  },
  mixins: [FrameMixin],
  props: {
    value: {
      required: true
    },
    multiple: Boolean,
    toggle: Boolean,
    chips: Boolean,
    options: {
      type: Array,
      required: true,
      validator: v => v.every(o => 'label' in o && 'value' in o)
    },
    frameColor: String,
    displayValue: String,
    clearable: Boolean
  },
  data () {
    return {
      terms: '',
      focused: false
    }
  },
  computed: {
    actualValue () {
      if (this.displayValue) {
        return this.displayValue
      }
      if (!this.multiple) {
        const opt = this.options.find(opt => (!opt.disable && opt.value === this.value))
        return opt ? opt.label : ''
      }

      const opt = this.selectedOptions.map(opt => opt.label)
      return opt.length ? opt.join(', ') : ''
    },
    selectedOptions () {
      if (this.multiple) {
        return this.length > 0
          ? this.options.filter(opt => (!opt.disable && this.value.includes(opt.value)))
          : []
      }
    },
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
    __toggleMultiple (value, disable) {
      if (disable) {
        return
      }
      const
        model = this.value,
        index = model.indexOf(value)

      if (index > -1) {
        model.splice(index, 1)
      }
      else {
        model.push(value)
      }

      this.$emit('input', model)
      this.$emit('change', model)
    },
    __emit (val) {
      if (this.value !== val) {
        this.$emit('input', val)
        this.$emit('change', val)
      }
    },
    clear () {
      this.__emit(this.multiple ? [] : null)
    }
  }
}
