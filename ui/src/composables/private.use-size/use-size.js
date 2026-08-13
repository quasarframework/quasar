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

/**
 * Creates a per-render callable size -> style resolver. The returned
 * objects are shared and reference-stable, so an unchanged size skips
 * style patching entirely -- do not mutate them.
 */
export function createSizeStyle(sizes) {
  const cache = new Map()

  return size => {
    if (size === void 0) return null

    let style = cache.get(size)

    if (style === void 0) {
      // size accepts any CSS font-size string, which could be generated
      // on the fly (e.g. animated), so guard against unbounded growth
      if (cache.size > 500) cache.clear()
      style = {
        fontSize: size in sizes ? `${sizes[size]}px` : size
      }
      cache.set(size, style)
    }

    return style
  }
}

export const getSizeStyle = /*#__PURE__*/ createSizeStyle(useSizeDefaults)
