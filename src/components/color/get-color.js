import extend from '../../utils/extend'
import { hexToRgb, rgbToHex, hsvToRgb, rgbToHsv } from '../../utils/colors'

export default function (color) {
  let result = extend(
    { h: 0, s: 0, v: 0, r: 0, g: 0, b: 0, a: 1, hex: '#000000' },
    color
  )

  // HSV input
  if (color.h !== undefined && color.s !== undefined && color.v !== undefined) {
    let rgb = hsvToRgb(color.h, color.s, color.v)
    let hex = `#${rgbToHex(rgb.r, rgb.g, rgb.b)}`

    result = { ...result, ...rgb, ...{ hex: hex } }
  }

  // RGB input
  if (color.r !== undefined && color.g !== undefined && color.b !== undefined) {
    let hsv = rgbToHsv(color.r, color.g, color.b)
    let hex = `#${rgbToHex(color.r, color.g, color.b)}`

    result = { ...result, ...hsv, ...{ hex: hex } }
  }

  // HEX input
  if (color.hex !== undefined) {
    let rgbArr = hexToRgb(color.hex.substring(1))
    let rgb = { r: rgbArr[0], g: rgbArr[1], b: rgbArr[2] }
    let hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)

    result = { ...result, ...rgb, ...hsv }
  }

  // ALPA input
  result = { ...result, ...{ a: color.a === undefined ? 1.0 : color.a } }

  return result
}
