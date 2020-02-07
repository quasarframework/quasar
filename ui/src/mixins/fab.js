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
  },

  methods: {
    __injectLabel (h, child) {
      child[this.leftLabel === true ? 'unshift' : 'push'](
        h('div', {
          class: `q-fab__label q-fab__label--${this.extended === true ? 'extended' : 'collapsed'}`
        }, [ this.label ])
      )
    }
  }
}
