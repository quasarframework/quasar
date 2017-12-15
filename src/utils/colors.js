export function rgbToHex (r, g, b, a) {
  const alpha = a !== void 0

  if (
    typeof r !== 'number' ||
    typeof g !== 'number' ||
    typeof b !== 'number' ||
    r > 255 ||
    g > 255 ||
    b > 255 ||
    (alpha && (typeof a !== 'number' || a > 100))
  ) {
    throw new TypeError('Expected 3 numbers below 256 (and optionally 1 below 100)')
  }

  const hex = alpha
    ? (b | g << 8 | r << 16 | a << 24) | 1 << 32
    : (b | g << 8 | r << 16) | 1 << 24

  return hex.toString(alpha ? 24 : 16).slice(1)
}

export function hexToRgb (hex) {
  if (typeof hex !== 'string') {
    throw new TypeError('Expected a string')
  }

  hex = hex.replace(/^#/, '')

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }
  else if (hex.length === 4) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
  }

  let num = parseInt(hex, 16)

  return hex.length > 6
    ? [num >> 24, num >> 16 & 255, num >> 8 & 255, (num & 255) / 255]
    : [num >> 16, num >> 8 & 255, num & 255]
}

export function hsvToRgb (h, s, v, a) {
  let r, g, b, i, f, p, q, t

  if (arguments.length === 1) {
    s = h.s
    v = h.v
    h = h.h
  }

  h = h / 360
  i = Math.floor(h * 6)
  f = h * 6 - i
  p = v * (1 - s)
  q = v * (1 - f * s)
  t = v * (1 - (1 - f) * s)

  switch (i % 6) {
    case 0:
      r = v
      g = t
      b = p
      break
    case 1:
      r = q
      g = v
      b = p
      break
    case 2:
      r = p
      g = v
      b = t
      break
    case 3:
      r = p
      g = q
      b = v
      break
    case 4:
      r = t
      g = p
      b = v
      break
    case 5:
      r = v
      g = p
      b = q
      break
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
    a
  }
}

export function rgbToHsv (r, g, b, a) {
  if (arguments.length === 1) {
    r = r.r
    g = r.g
    b = r.b
  }

  let
    max = Math.max(r, g, b), min = Math.min(r, g, b),
    d = max - min,
    h,
    s = (max === 0 ? 0 : d / max),
    v = max / 255

  switch (max) {
    case min:
      h = 0
      break
    case r:
      h = (g - b) + d * (g < b ? 6 : 0)
      h /= 6 * d
      break
    case g:
      h = (b - r) + d * 2
      h /= 6 * d
      break
    case b:
      h = (r - g) + d * 4
      h /= 6 * d
      break
  }

  return {
    h: h * 360,
    s: s,
    v: v,
    a
  }
}
