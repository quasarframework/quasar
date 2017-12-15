import extend from './extend'

export function rgbToHex (r, g, b) {
  if (typeof r === 'string') {
    const res = r.match(/\b\d{1,3}\b/g).map(Number)
    r = res[0]
    g = res[1]
    b = res[2]
  }

  if (
    typeof r !== 'number' ||
    typeof g !== 'number' ||
    typeof b !== 'number' ||
    r > 255 ||
    g > 255 ||
    b > 255
  ) {
    throw new TypeError('Expected three numbers below 256')
  }

  return ((b | g << 8 | r << 16) | 1 << 24).toString(16).slice(1)
}

export function hexToRgb (hex) {
  if (typeof hex !== 'string') {
    throw new TypeError('Expected a string')
  }

  hex = hex.replace(/^#/, '')

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }
  if (hex.length === 4) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
  }

  let num = parseInt(hex, 16)

  if (hex.length > 6) {
    return [num >> 24, num >> 16 & 255, num >> 8 & 255, (num & 255) / 255]
  }

  return [num >> 16, num >> 8 & 255, num & 255]
}

export function hsvToRgb (h, s, v) {
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
    b: Math.round(b * 255)
  }
}

export function rgbToHsv (r, g, b) {
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
    v: v
  }
}

export function colorChange (inputColor) {
  let outputColor = extend(
    { h: 0, s: 0, v: 0, r: 0, g: 0, b: 0, a: 1, hex: '#000000' },
    inputColor
  )

  // HSV input
  if (inputColor.h !== undefined && inputColor.s !== undefined && inputColor.v !== undefined) {
    let rgb = hsvToRgb(inputColor.h, inputColor.s, inputColor.v)
    let hex = `#${rgbToHex(rgb.r, rgb.g, rgb.b)}`

    outputColor = { ...outputColor, ...rgb, ...{ hex: hex } }
  }

  // RGB input
  if (inputColor.r !== undefined && inputColor.g !== undefined && inputColor.b !== undefined) {
    let hsv = rgbToHsv(inputColor.r, inputColor.g, inputColor.b)
    let hex = `#${rgbToHex(inputColor.r, inputColor.g, inputColor.b)}`

    outputColor = { ...outputColor, ...hsv, ...{ hex: hex } }
  }

  // HEX input
  if (inputColor.hex !== undefined) {
    let rgbArr = hexToRgb(inputColor.hex)
    let rgb = { r: rgbArr[0], g: rgbArr[1], b: rgbArr[2] }
    let hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)

    outputColor = { ...outputColor, ...rgb, ...hsv }

    if (rgbArr.length === 4) {
      inputColor.a = rgbArr[3]
    }
  }

  // ALPA input
  outputColor = { ...outputColor, ...{ a: inputColor.a === undefined ? 1.0 : inputColor.a } }

  return outputColor
}
