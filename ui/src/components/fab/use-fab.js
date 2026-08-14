import { computed } from 'vue'

import QBtn from '../btn/QBtn.js'

const labelPositions = ['top', 'right', 'bottom', 'left']

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
    type: [String, Number],
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
  labelClass: [Array, String, Object],
  labelStyle: [Array, String, Object],

  disable: Boolean,

  tabindex: [Number, String]
}

// both FAB components render the label into the button's content themselves
const renderedByTheFab = ['label']

// the useFabProps entries QBtn declares itself, derived from QBtn so the two
// cannot fall out of step; the rest are consumed here (label placement,
// anchoring, the FAB's own state) and would render as stray DOM attributes if
// they were forwarded along with them. The resulting list is pinned in
// use-fab.test.js, so a QBtn-side rename fails there instead of silently
// dropping a prop the FAB is documented to forward.
const btnPropList = Object.keys(useFabProps).filter(
  name => !renderedByTheFab.includes(name) && QBtn.props[name] !== void 0
)

export function getFabBtnProps(props) {
  const acc = {}
  for (const name of btnPropList) {
    acc[name] = props[name]
  }
  return acc
}

export default function useFab(props, showing) {
  return {
    formClass: computed(
      () => `q-fab--form-${props.square ? 'square' : 'rounded'}`
    ),

    stacked: computed(
      () =>
        !props.externalLabel && ['top', 'bottom'].includes(props.labelPosition)
    ),

    labelProps: computed(() => {
      if (props.externalLabel) {
        const hideLabel =
          props.hideLabel === null ? !showing.value : props.hideLabel

        return {
          action: 'push',
          data: {
            class: [
              props.labelClass,
              'q-fab__label q-tooltip--style q-fab__label--external' +
                ` q-fab__label--external-${props.labelPosition}` +
                (hideLabel ? ' q-fab__label--external-hidden' : '')
            ],
            style: props.labelStyle
          }
        }
      }

      return {
        action: ['left', 'top'].includes(props.labelPosition)
          ? 'unshift'
          : 'push',
        data: {
          class: [
            props.labelClass,
            `q-fab__label q-fab__label--internal q-fab__label--internal-${props.labelPosition}` +
              (props.hideLabel ? ' q-fab__label--internal-hidden' : '')
          ],
          style: props.labelStyle
        }
      }
    })
  }
}
