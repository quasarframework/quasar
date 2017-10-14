import XLSX from 'xlsx'
import { isObject } from './is.js'

/*
 * Convert Array<Object> to Array<Array>
 *
 * @example
 * case 1: Keys header (Object.keys(aoo[0]))
 * // input
 * [{a:1, b:2},{a:3, b:4}]
 * // output
 * [
 *   ['a', 'b'],
 *   [1,2],
 *   [3,4]
 * ]
 * 
 * case 2: No header
 * // input
 * [{a:1, b:2},{a:3, b:4}], {header: null}
 * // output
 * [
 *   [1,2],
 *   [3,4]
 * ]
 * 
 * case 3: Named header (Object's values)
 * // input
 * [{a:1, b:2},{a:3, b:4}], {header: {a:'foo', b:'bar'}}
 * // output
 * [
 *   ['foo', 'bar'],
 *   [1,2],
 *   [3,4]
 * ]
 * 
 * case 4: Keys header + Fields ordered
 * // input
 * [{a:1, b:2},{a:3, b:4}], {header: [{b: null}, {a: null}]}
 * // output
 * [
 *   ['b', 'a'],
 *   [1,2],
 *   [3,4]
 * ]
 * 
 * case 5: No header + Fields ordered
 * // input
 * [{a:1, b:2},{a:3, b:4}], {header: ['b', 'a']}
 * // output
 * [
 *   [2,1],
 *   [4,3]
 * ]
 * 
 * case 6: Named header + Fields ordered
 * // input
 * [{a:1, b:2},{a:3, b:4}], {header: [{b: 'bar'}, {a: 'foo'}]}
 * // output
 * [
 *   ['bar','foo'],
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
    let header = []
    options.header.forEach(vOrObj => {
      if (isObject(vOrObj)) {
        let o = vOrObj
        let k = Object.keys(o)[0]
        order.push(k)
        if (o[k] === null) {
          header.push(k)
        }
        else {
          header.push(o[k])
        }
        return
      }
      order.push(vOrObj)
    })
    if (header.length > 0) {
      aoa.push(header)
    }
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
 * Convert string to array buffer
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
 * Convert string to blob for download
 */
function s2blob (s) {
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
      // https://github.com/SheetJS/js-xlsx#output-type
      type: 'binary'
    }

  XLSX.utils.book_append_sheet(wb, ws, sheetName)

  let s = XLSX.write(wb, wopts)

  switch (options.type) {
    case 'string':
      return s
    case 'buffer':
      return s2ab(s)
    default:
      return s2blob(s)
  }
}
