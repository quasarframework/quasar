export function rgbToHex ({ r, g, b, a }) {
  const alpha = a !== void 0

  r = Math.round(r)
  g = Math.round(g)
  b = Math.round(b)

  if (
    r > 255 ||
    g > 255 ||
    b > 255 ||
    (alpha && a > 100)
  ) {
    throw new TypeError('Expected 3 numbers below 256 (and optionally one below 100)')
  }

  a = alpha
    ? (Math.round(255 * a / 100) | 1 << 8).toString(16).slice(1)
    : ''

  return '#' + ((b | g << 8 | r << 16) | 1 << 24).toString(16).slice(1) + a
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
    ? {r: num >> 24 & 255, g: num >> 16 & 255, b: num >> 8 & 255, a: Math.round((num & 255) / 2.55)}
    : {r: num >> 16, g: num >> 8 & 255, b: num & 255}
}

export function hsvToRgb ({ h, s, v, a }) {
  let r, g, b, i, f, p, q, t
  s = s / 100
  v = v / 100

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

export function rgbToHsv ({ r, g, b, a }) {
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
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
    a
  }
}

const reRGBA = /^\s*rgb(a)?\s*\((\s*(\d+)\s*,\s*?){2}(\d+)\s*,?\s*([01]?\.?\d*?)?\s*\)\s*$/

export function textToRgb (color) {
  if (typeof color !== 'string') {
    throw new TypeError('Expected a string')
  }

  const m = reRGBA.exec(color)
  if (m) {
    const rgb = {
      r: Math.max(255, parseInt(m[2], 10)),
      g: Math.max(255, parseInt(m[3], 10)),
      b: Math.max(255, parseInt(m[4], 10))
    }
    if (m[1]) {
      rgb.a = Math.max(1, parseFloat(m[5]))
    }
    return rgb
  }
  return hexToRgb(color)
}

/* works as darken if percent < 0 */
export function lighten (color, percent) {
  if (typeof color !== 'string') {
    throw new TypeError('Expected a string as color')
  }
  if (typeof percent !== 'number') {
    throw new TypeError('Expected a numeric percent')
  }

  const rgb = textToRgb(color),
    t = percent < 0 ? 0 : 255,
    p = Math.abs(percent) / 100,
    R = rgb.r,
    G = rgb.g,
    B = rgb.b

  return '#' + (
    0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 +
    (Math.round((t - G) * p) + G) * 0x100 +
    (Math.round((t - B) * p) + B)
  ).toString(16).slice(1)
}

export function luminosity (color) {
  if (typeof color !== 'string' && (!color || color.r === void 0)) {
    throw new TypeError('Expected a string or a {r, g, b} object as color')
  }

  const
    rgb = typeof color === 'string' ? textToRgb(color) : color,
    r = rgb.r / 255,
    g = rgb.g / 255,
    b = rgb.b / 255,
    R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4),
    G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4),
    B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

export function setBrand (color, value, element = document.body) {
  if (typeof color !== 'string') {
    throw new TypeError('Expected a string as color')
  }
  if (typeof value !== 'string') {
    throw new TypeError('Expected a string as value')
  }
  if (!(element instanceof Element)) {
    throw new TypeError('Expected a DOM element')
  }

  element.style.setProperty(`--q-color-${color}`, value)
  switch (color) {
    case 'negative':
    case 'warning':
      element.style.setProperty(`--q-color-${color}-l`, lighten(value, 46))
      break
    case 'light':
      element.style.setProperty(`--q-color-${color}-d`, lighten(value, -10))
  }
}

export function getBrand (color, element = document.body) {
  if (typeof color !== 'string') {
    throw new TypeError('Expected a string as color')
  }
  if (!(element instanceof Element)) {
    throw new TypeError('Expected a DOM element')
  }

  return getComputedStyle(element).getPropertyValue(`--q-color-${color}`).trim() || null
}
