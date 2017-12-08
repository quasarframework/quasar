import { QIcon } from '../components/icon'
import { QInputFrame } from '../components/input-frame'
import { QChip } from '../components/chip'
import FrameMixin from './input-frame'
import clone from '../utils/clone'

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
      model: clone(this.value),
      terms: '',
      focused: false
    }
  },
  watch: {
    value (val) {
      this.model = clone(val)
    }
  },
  computed: {
    actualValue () {
      if (this.displayValue) {
        return this.displayValue
      }
      if (!this.multiple) {
        const opt = this.options.find(opt => opt.value === this.model)
        return opt ? opt.label : ''
      }

      const opt = this.selectedOptions.map(opt => opt.label)
      return opt.length ? opt.join(', ') : ''
    },
    selectedOptions () {
      if (this.multiple) {
        return this.length > 0
          ? this.options.filter(opt => this.model.includes(opt.value))
          : []
      }
    },
    hasChips () {
      return this.multiple && this.chips
    },
    length () {
      return this.multiple
        ? this.model.length
        : ([null, undefined, ''].includes(this.model) ? 0 : 1)
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
        model = this.model,
        index = model.indexOf(value)

      if (index > -1) {
        model.splice(index, 1)
      }
      else {
        model.push(value)
      }

      this.$emit('input', model)
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
