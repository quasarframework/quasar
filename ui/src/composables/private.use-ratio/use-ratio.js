import { computed } from 'vue'

export const useRatioProps = {
  /**
   * Aspect ratio for the component content; If value is a String, then avoid using a computational statement (like '16/9') and instead specify the String result directly (eg. '1.7777')
   *
   * @api prop ratio
   * @type {String|Number}
   * @category style
   * @example ':ratio="4/3"'
   * @example ':ratio="16/9"'
   */
  ratio: [String, Number]
}

export default function useRatio(props, naturalRatio) {
  return computed(() => {
    const rawValue = props.ratio || naturalRatio?.value
    if (typeof rawValue === 'string' && rawValue.trim() === '') {
      return null
    }

    const ratio = Number(rawValue)
    return Number.isFinite(ratio) && ratio > 0
      ? { paddingBottom: `${100 / ratio}%` }
      : null
  })
}
