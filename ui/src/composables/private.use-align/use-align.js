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
  /**
   * Specify how to align content
   *
   * @api prop align
   * @type {String}
   * @category content
   * @optional
   * @value 'left'
   * @value 'center'
   * @value 'right'
   * @value 'between'
   * @value 'around'
   * @value 'evenly'
   * @value 'stretch'
   */
  align: {
    type: String,
    validator: v => alignValues.includes(v)
  }
}

export default function useAlign(props) {
  // return alignClass
  return computed(() => {
    const align =
      props.align === void 0
        ? props.vertical
          ? 'stretch'
          : 'left'
        : props.align

    return `${props.vertical ? 'items' : 'justify'}-${alignMap[align]}`
  })
}
