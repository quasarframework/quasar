export default {
  props: {
    type: {
      type: String,
      default: 'a'
    },
    outline: Boolean,
    push: Boolean,
    flat: Boolean,
    unelevated: Boolean,
    color: String,
    textColor: String,
    glossy: Boolean,

    extended: Boolean,
    label: {
      type: [ String, Number ],
      default: ''
    },
    leftLabel: Boolean,

    disable: Boolean
  }
}
