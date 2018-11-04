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
    dark: Boolean
  },

  computed: {
    editable () {
      return this.disable !== true && this.readonly !== true
    }
  },

  methods: {
    __pad (unit) {
      return (unit < 10 ? '0' : '') + unit
    }
  }
}
