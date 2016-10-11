/*
 * Credits go to sindresorhus
 */

export function rgbToHex (red, green, blue) {
  if (typeof red === 'string') {
    const res = red.match(/\b\d{1,3}\b/g).map(Number)
    red = res[0]
    green = res[1]
    blue = res[2]
  }

  if (
    typeof red !== 'number' ||
    typeof green !== 'number' ||
    typeof blue !== 'number' ||
    red > 255 ||
    green > 255 ||
    blue > 255
  ) {
    throw new TypeError('Expected three numbers below 256')
  }

  return ((blue | green << 8 | red << 16) | 1 << 24).toString(16).slice(1)
}

export function hexToRgb (hex) {
  if (typeof hex !== 'string') {
    throw new TypeError('Expected a string')
  }

  hex = hex.replace(/^#/, '')

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }

  let num = parseInt(hex, 16)

  return [num >> 16, num >> 8 & 255, num & 255]
}
