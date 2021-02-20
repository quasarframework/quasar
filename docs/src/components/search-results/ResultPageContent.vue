<template lang="pug">
q-item.app-search__result(
  :id="entry.id"
  :active="active"
  clickable
  @click="entry.onClick"
  @mouseenter="entry.onMouseenter"
)
  q-item-section
    .app-search__result-title {{ entry.title }}
    .app-search__result-content
      span(
        v-for="(item, index) in entry.content"
        :key="index"
        :class="item.class"
      ) {{ item.str }}

  slot
</template>

<script>
const contentRE = /(<em>|<\/em>)/
const startsWithRE = /^[a-z0-9]/
const endsWithRE = /[a-z0-9]$/

function parseContent (content) {
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
        class: inToken ? 'app-search__result-content--token' : null
      })
      inToken = !inToken
    }
  })
  return acc
}

export default {
  name: 'ResultPageContent',
  props: { entry: Object, active: Boolean },

  extractProps (hit) {
    return {
      title: [ hit.l1, hit.l2, hit.l3, hit.l4, hit.l5 ].filter(e => e).join(' » '),
      content: parseContent(hit._formatted.content)
    }
  }
}
</script>
