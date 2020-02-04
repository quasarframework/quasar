export function copyToClipboard (text) {
  var textArea = document.createElement('textarea')
  textArea.className = 'fixed-top'
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  document.execCommand('copy')
  document.body.removeChild(textArea)
}

export function copyHeading (id, queryParams = null) {
  const queryString = queryParams === null
    ? ''
    : Object.keys(queryParams)
      .map(param => `${param}=${queryParams[param]}`)
      .join('&')
  const text = window.location.origin + window.location.pathname + (queryString === null ? '' : `?${queryString}`) + '#' + id

  copyToClipboard(text)

  this.$q.notify({
    message: 'Anchor has been copied to clipboard.',
    color: 'white',
    textColor: 'primary',
    position: 'top',
    actions: [ { icon: 'close', color: 'primary' } ],
    timeout: 2000
  })
}

export function slugify (str) {
  return encodeURIComponent(String(str).trim().replace(/\s+/g, '-'))
}
