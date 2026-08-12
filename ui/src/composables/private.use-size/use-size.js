import { computed } from 'vue'

export const useSizeDefaults = {
  xs: 18,
  sm: 24,
  md: 32,
  lg: 38,
  xl: 46
}

export const useSizeProps = {
  size: String
}

const sizeStyleCache = new Map()

/**
 * Per-render callable alternative to useSize() for mount-dominated
 * components (default sizes only). The returned objects are shared and
 * reference-stable, so an unchanged size skips style patching entirely --
 * do not mutate them.
 */
export function getSizeStyle(size) {
  if (size === void 0) return null

  let style = sizeStyleCache.get(size)

  if (style === void 0) {
    // size accepts any CSS font-size string, which could be generated
    // on the fly (e.g. animated), so guard against unbounded growth
    if (sizeStyleCache.size > 500) sizeStyleCache.clear()
    style = {
      fontSize: size in useSizeDefaults ? `${useSizeDefaults[size]}px` : size
    }
    sizeStyleCache.set(size, style)
  }

  return style
}

export default function useSize(props, sizes = useSizeDefaults) {
  // return sizeStyle
  return computed(() =>
    props.size !== void 0
      ? {
          fontSize: props.size in sizes ? `${sizes[props.size]}px` : props.size
        }
      : null
  )
}
