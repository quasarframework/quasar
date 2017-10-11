import XLSX from 'xlsx'
import { isObject } from './is.js'

/*
 * array<object> to array<array>
 * @example
 * case 1: header will be Object.keys(aoo[0])
 * // input
 * [{a:1, b:2},{a:3, b:4}]
 * // output
 * [
 *   ['a', 'b'],
 *   [1,2],
 *   [3,4]
 * ]
 * 
 * case 2: skip header
 * // input
 * [{a:1, b:2},{a:3, b:4}], {header: null}
 * // output
 * [
 *   [1,2],
 *   [3,4]
 * ]
 * 
 * case 3: header will be Object's values and order will be Object.keys
 * // input
 * [{a:1, b:2},{a:3, b:4}], {header: {a:'foo', b:'bar'}}
 * // output
 * [
 *   ['foo', 'bar'],
 *   [1,2],
 *   [3,4]
 * ]
 * 
 * case 4: header and order will be as options.header
 * // input
 * [{a:1, b:2},{a:3, b:4}], {header: ['b', 'a']}
 * // output
 * [
 *   ['b','a'],
 *   [2,1],
 *   [4,3]
 * ]
 */
function ooa2aoa (ooa, options = {}) {
  let aoa = []
  if (!Array.isArray) {
    return aoa
  }
  if (ooa.length <= 0) {
    return aoa
  }
  let order = []
  if (Array.isArray(options.header)) {
    order = options.header
    aoa.push(options.header)
  }
  else if (options.header === null) {
    order = Object.keys(ooa[0])
    // skip header
  }
  else if (isObject(options.header)) {
    order = []
    let header = []
    Object.keys(options.header).map(k => {
      order.push(k)
      header.push(options.header[k])
    })
    aoa.push(header)
  }
  else {
    order = Object.keys(ooa[0])
    aoa.push(order)
  }

  ooa.forEach(o => {
    let a = []
    order.forEach(k => {
      a.push(o[k])
    })
    aoa.push(a)
  })
  return aoa
}

/**
 * string to array buffer
 */
function s2ab (s) {
  let buf = new ArrayBuffer(s.length)
  let view = new Uint8Array(buf)
  for (let i = 0; i !== s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xFF
  }
  return buf
}

/**
 * to download stream
 */
function s2bin (s) {
  return new Blob([s2ab(s)], {type: 'application/octet-stream'})
}

export function to (ext, ooa, options = {}) {
  // https://github.com/SheetJS/js-xlsx#supported-output-formats
  let
    wb = XLSX.utils.book_new(),
    ws = XLSX.utils.aoa_to_sheet(ooa2aoa(ooa, options)),
    sheetName = options.sheetName || 'Sheet 1',
    wopts = {
      bookType: ext,
      bookSST: false,
      type: options.type || 'binary'
    }

  XLSX.utils.book_append_sheet(wb, ws, sheetName)

  let s = XLSX.write(wb, wopts)

  if (options.blob === false) {
    return s2ab(s)
  }
  return s2bin(s)
}
