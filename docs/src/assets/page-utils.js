import { Notify } from 'quasar'
import { slugify } from '../../build/utils.js'

export function copyToClipboard (text) {
  const textArea = document.createElement('textarea')
  textArea.className = 'fixed-top'
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  document.execCommand('copy')
  document.body.removeChild(textArea)
}

export function copyHeading (id) {
  const text = window.location.origin + window.location.pathname + '#' + id
  const el = document.getElementById(id)

  if (el) {
    el.id = ''
  }

  if ('replaceState' in history) {
    history.replaceState(history.state, '', `${location.pathname}#${id}`)
  }
  else {
    window.location.hash = '#' + id
  }

  if (el) {
    setTimeout(() => {
      el.id = id
    }, 300)
  }

  copyToClipboard(text)

  Notify.create({
    message: 'Anchor has been copied to clipboard.',
    position: 'top',
    actions: [{ icon: 'cancel', color: 'white', dense: true, round: true }],
    timeout: 2000
  })
}

export { slugify }
