import { computed } from 'vue'

export const useRatioProps = {
  ratio: [ String, Number ]
}

export default function (props, naturalRatio) {
  // return ratioStyle
  return computed(() => {
    const ratio = Number(
      props.ratio || (naturalRatio !== void 0 ? naturalRatio.value : void 0)
    )

    return isNaN(ratio) !== true && ratio > 0
      ? { paddingBottom: `${ 100 / ratio }%` }
      : null
  })
}
