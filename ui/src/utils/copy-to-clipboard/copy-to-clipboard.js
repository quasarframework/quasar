import { addFocusout, removeFocusout } from '../private.focus/focusout.js'

function fallback (text) {
  const area = document.createElement('textarea')
  area.value = text
  area.contentEditable = 'true'
  area.style.position = 'fixed' // avoid scrolling to bottom

  const fn = () => {}
  addFocusout(fn)

  document.body.appendChild(area)
  area.focus()
  area.select()

  const res = document.execCommand('copy')

  area.remove()
  removeFocusout(fn)

  return res
}

export default function (text) {
  return navigator.clipboard !== void 0
    ? navigator.clipboard.writeText(text)
    : new Promise((resolve, reject) => {
      const res = fallback(text)
      if (res) {
        resolve(true)
      }
      else {
        reject(res)
      }
    })
}
