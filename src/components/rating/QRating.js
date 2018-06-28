import { getEventKey, stopAndPrevent } from '../../utils/event'
import { between } from '../../utils/format'
import { QIcon } from '../icon'

export default {
  name: 'QRating',
  props: {
    value: Number,
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
      set (value) {
        this.$emit('input', value)
        this.$nextTick(() => {
          if (JSON.stringify(value) !== JSON.stringify(this.value)) {
            this.$emit('change', value)
          }
        })
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
        const model = between(parseInt(value, 10), 1, this.max)
        this.model = this.model === model ? 0 : model
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
    const
      child = [],
      tabindex = this.editable ? 0 : -1

    for (let i = 1; i <= this.max; i++) {
      child.push(h('span', {
        key: i,
        ref: `rt${i}`,
        attrs: { tabindex },
        on: {
          keydown: e => {
            switch (getEventKey(e)) {
              case 13:
              case 32:
                this.set(i)
                return stopAndPrevent(e)
              case 37: // LEFT ARROW
              case 40: // DOWN ARROW
                if (this.$refs[`rt${i - 1}`]) {
                  this.$refs[`rt${i - 1}`].focus()
                }
                return stopAndPrevent(e)
              case 39: // RIGHT ARROW
              case 38: // UP ARROW
                if (this.$refs[`rt${i + 1}`]) {
                  this.$refs[`rt${i + 1}`].focus()
                }
                return stopAndPrevent(e)
            }
          }
        }
      }, [
        h(QIcon, {
          props: { name: this.icon || this.$q.icon.rating.icon },
          'class': {
            active: (!this.mouseModel && this.model >= i) || (this.mouseModel && this.mouseModel >= i),
            exselected: this.mouseModel && this.model >= i && this.mouseModel < i,
            hovered: this.mouseModel === i
          },
          attrs: { tabindex: -1 },
          nativeOn: {
            click: () => this.set(i),
            mouseover: () => this.__setHoverValue(i),
            mouseout: () => { this.mouseModel = 0 },
            focus: () => this.__setHoverValue(i),
            blur: () => { this.mouseModel = 0 }
          }
        })
      ]))
    }

    return h('div', {
      staticClass: 'q-rating row inline items-center no-wrap',
      'class': this.classes,
      style: this.size ? `font-size: ${this.size}` : ''
    }, child)
  }
}
