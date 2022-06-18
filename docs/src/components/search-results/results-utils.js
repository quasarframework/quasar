const contentRE = /(<em>|<\/em>)/
const startsWithRE = /^[a-z0-9]/
const endsWithRE = /[a-z0-9]$/

export function parseContent (content) {
  if (!content) {
    return
  }

  let inToken = false

  const acc = []
  const str = (
    (startsWithRE.test(content) ? '...' : '') +
    content +
    (endsWithRE.test(content) ? '...' : '')
  )

  str.split(contentRE).forEach(str => {
    if (str === '') {
      inToken = true
    }
    else if (str !== '<em>' && str !== '</em>') {
      acc.push({
        str,
        class: inToken ? 'app-search__result-token' : null
      })
      inToken = !inToken
    }
  })

  return acc
}
