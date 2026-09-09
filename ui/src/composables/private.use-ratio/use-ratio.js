import { computed } from 'vue'

export const useRatioProps = {
  ratio: [String, Number]
}

export default function useRatio(props, naturalRatio) {
  return computed(() => {
    const rawValue = props.ratio || naturalRatio?.value
    if (typeof rawValue === 'string' && rawValue.trim() === '') {
      return null
    }

    const aspectRatio = Number(rawValue)
    return Number.isFinite(aspectRatio) && aspectRatio > 0
      ? { aspectRatio }
      : null
  })
}
