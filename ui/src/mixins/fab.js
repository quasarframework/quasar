import ListenersMixin from './listeners.js'

const labelPositions = ['top', 'right', 'bottom', 'left']

export default {
  mixins: [ ListenersMixin ],

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

    square: Boolean,
    padding: String,

    label: {
      type: [ String, Number ],
      default: ''
    },
    labelPosition: {
      type: String,
      default: 'right',
      validator: v => labelPositions.includes(v)
    },
    externalLabel: Boolean,
    hideLabel: {
      type: Boolean
    },
    labelClass: [ Array, String, Object ],
    labelStyle: [ Array, String, Object ],

    disable: Boolean,

    tabindex: [ Number, String ]
  },

  computed: {
    formClass () {
      return `q-fab--form-${this.square === true ? 'square' : 'rounded'}`
    },

    stacked () {
      return this.externalLabel === false && ['top', 'bottom'].includes(this.labelPosition)
    },

    labelProps () {
      if (this.externalLabel === true) {
        const hideLabel = this.hideLabel === null
          ? this.showing === false
          : this.hideLabel

        return {
          action: 'push',
          data: {
            staticClass: 'q-fab__label q-tooltip--style q-fab__label--external' +
              ` q-fab__label--external-${this.labelPosition}` +
              (hideLabel === true ? ' q-fab__label--external-hidden' : ''),
            style: this.labelStyle,
            class: this.labelClass
          }
        }
      }

      return {
        action: [ 'left', 'top' ].includes(this.labelPosition)
          ? 'unshift'
          : 'push',
        data: {
          staticClass: `q-fab__label q-fab__label--internal q-fab__label--internal-${this.labelPosition}` +
            (this.hideLabel === true ? ' q-fab__label--internal-hidden' : ''),
          style: this.labelStyle,
          class: this.labelClass
        }
      }
    }
  }
}
