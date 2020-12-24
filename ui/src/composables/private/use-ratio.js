import { computed } from 'vue'

export const useRatioProps = {
  ratio: [ String, Number ]
}

export default function (props, naturalRatio) {
  return {
    ratioStyle: computed(() => {
      const ratio = props.ratio || (naturalRatio !== void 0 ? naturalRatio.value : void 0)

      return ratio !== void 0
        ? { paddingBottom: `${ 100 / ratio }%` }
        : null
    })
  }
}
