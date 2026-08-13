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

// returns an alignClass() getter
export default function useAlign(props) {
  return () => {
    const align =
      props.align === void 0
        ? props.vertical
          ? 'stretch'
          : 'left'
        : props.align

    return `${props.vertical ? 'items' : 'justify'}-${alignMap[align]}`
  }
}
