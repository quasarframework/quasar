import { computed } from 'vue'

const labelPositions = [ 'top', 'right', 'bottom', 'left' ]

export const useFabProps = {
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
}

export default function (props, showing) {
  return {
    formClass: computed(() =>
      `q-fab--form-${ props.square === true ? 'square' : 'rounded' }`
    ),

    stacked: computed(() =>
      props.externalLabel === false
      && [ 'top', 'bottom' ].includes(props.labelPosition)
    ),

    labelProps: computed(() => {
      if (props.externalLabel === true) {
        const hideLabel = props.hideLabel === null
          ? showing.value === false
          : props.hideLabel

        return {
          action: 'push',
          data: {
            class: [
              props.labelClass,
              'q-fab__label q-tooltip--style q-fab__label--external'
              + ` q-fab__label--external-${ props.labelPosition }`
              + (hideLabel === true ? ' q-fab__label--external-hidden' : '')
            ],
            style: props.labelStyle
          }
        }
      }

      return {
        action: [ 'left', 'top' ].includes(props.labelPosition)
          ? 'unshift'
          : 'push',
        data: {
          class: [
            props.labelClass,
            `q-fab__label q-fab__label--internal q-fab__label--internal-${ props.labelPosition }`
            + (props.hideLabel === true ? ' q-fab__label--internal-hidden' : '')
          ],
          style: props.labelStyle
        }
      }
    })
  }
}
