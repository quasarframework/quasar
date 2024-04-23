import { computed } from 'vue'

export const alignMap = {
  left: 'start',
  center: 'center',
  right: 'end',
  between: 'between',
  around: 'around',
  evenly: 'evenly',
  stretch: 'stretch'
}

export const alignValues = Object.keys(alignMap)

export const useAlignProps = {
  align: {
    type: String,
    validator: v => alignValues.includes(v)
  }
}

export default function (props) {
  // return alignClass
  return computed(() => {
    const align = props.align === void 0
      ? props.vertical === true ? 'stretch' : 'left'
      : props.align

    return `${ props.vertical === true ? 'items' : 'justify' }-${ alignMap[ align ] }`
  })
}
