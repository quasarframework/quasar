export default {
  props: {
    value: {
      type: String,
      required: true
    },
    min: {
      type: String,
      default: null
    },
    max: {
      type: String,
      default: null
    },

    defaultValue: {
      type: String,
      default: null
    },
    orientation: {
      type: String,
      default: 'portrait',
      validator: v => ['portrait', 'landscape'].includes(v)
    },

    color: String,
    textColor: String,
    dark: Boolean,

    readonly: Boolean,
    disable: Boolean
  },

  computed: {
    editable () {
      return this.disable !== true && this.readonly !== true
    },

    computedColor () {
      return this.color || 'primary'
    },

    computedTextColor () {
      return this.textColor || 'white'
    },

    headerClass () {
      const cls = []
      this.color !== void 0 && cls.push(`bg-${this.color}`)
      this.textColor !== void 0 && cls.push(`text-${this.textColor}`)
      return cls.join(' ')
    }
  },

  methods: {
    __pad (unit) {
      return (unit < 10 ? '0' : '') + unit
    }
  }
}
