export default {
  props: {
    value: {
      required: true
    },

    landscape: Boolean,

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

    computedTabindex () {
      return this.editable === true ? 0 : -1
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
