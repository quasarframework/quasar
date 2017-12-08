import { between } from '../../utils/format'
import { QIcon } from '../icon'

export default {
  name: 'q-rating',
  props: {
    value: {
      type: Number,
      default: 0,
      required: true
    },
    max: {
      type: Number,
      default: 5
    },
    icon: String,
    color: String,
    size: String,
    readonly: Boolean,
    disable: Boolean
  },
  data () {
    return {
      mouseModel: 0
    }
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (val) {
        if (this.value !== val) {
          this.$emit('input', val)
          this.$emit('change', val)
        }
      }
    },
    editable () {
      return !this.readonly && !this.disable
    },
    classes () {
      const cls = []

      this.disable && cls.push('disabled')
      this.editable && cls.push('editable')
      this.color && cls.push(`text-${this.color}`)

      return cls
    }
  },
  methods: {
    set (value) {
      if (this.editable) {
        this.model = between(parseInt(value, 10), 1, this.max)
        this.mouseModel = 0
      }
    },
    __setHoverValue (value) {
      if (this.editable) {
        this.mouseModel = value
      }
    }
  },
  render (h) {
    const child = []

    for (let i = 1; i <= this.max; i++) {
      child.push(h(QIcon, {
        key: i,
        props: { name: this.icon || this.$q.icon.rating.icon },
        'class': {
          active: (!this.mouseModel && this.model >= i) || (this.mouseModel && this.mouseModel >= i),
          exselected: this.mouseModel && this.model >= i && this.mouseModel < i,
          hovered: this.mouseModel === i
        },
        on: {
          click: () => this.set(i),
          mouseover: () => this.__setHoverValue(i),
          mouseout: () => { this.mouseModel = 0 }
        }
      }))
    }

    return h('div', {
      staticClass: 'q-rating row inline items-center no-wrap',
      'class': this.classes,
      style: this.size ? `font-size: ${this.size}` : ''
    }, child)
  }
}
