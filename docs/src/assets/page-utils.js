import { Notify } from 'quasar'

export { slugify } from '../../build/utils.js'

export function copyToClipboard(text) {
  // the copy borrows the focus; whoever triggered it must get it back, or a
  // keyboard user is dropped at the top of the document on every copy
  const trigger = document.activeElement

  const textArea = document.createElement('textarea')
  textArea.className = 'fixed-top'
  textArea.value = text
  document.body.append(textArea)
  textArea.focus()
  textArea.select()

  document.execCommand('copy')
  textArea.remove()

  if (trigger !== null && trigger.isConnected) {
    trigger.focus()
  }
}

export function copyHeading(id) {
  const text = window.location.origin + window.location.pathname + '#' + id
  const el = document.getElementById(id)

  if (el) {
    el.id = ''
  }

  if ('replaceState' in history) {
    history.replaceState(history.state, '', `${location.pathname}#${id}`)
  } else {
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
