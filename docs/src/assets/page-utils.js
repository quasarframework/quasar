export function copyHeading (id) {
  const text = window.location.origin + window.location.pathname + '#' + id

  var textArea = document.createElement('textarea')
  textArea.className = 'fixed-top'
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  document.execCommand('copy')
  document.body.removeChild(textArea)

  this.$q.notify({
    message: 'Anchor has been copied to clipboard.',
    color: 'primary',
    position: 'top',
    actions: [ { icon: 'close', color: 'white' } ],
    timeout: 2000
  })
}

export function slugify (str) {
  return encodeURIComponent(String(str).trim().replace(/\s+/g, '-'))
}
