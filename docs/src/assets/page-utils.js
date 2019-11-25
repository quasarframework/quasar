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

export function copyHeading (id) {
  const text = window.location.origin + window.location.pathname + '#' + id

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

export function groupBy (list, groupKey, defaultGroupKeyValue) {
  const res = {}

  for (let key in list) {
    if (list.hasOwnProperty(key)) {
      let value = list[key]
      let groupKeyValue = (value[groupKey] || defaultGroupKeyValue).split('|')
      for (let groupKeyV of groupKeyValue) {
        if (res[groupKeyV] === void 0) {
          res[groupKeyV] = {}
        }
        res[groupKeyV][key] = value
      }
    }
  }

  return res
}
