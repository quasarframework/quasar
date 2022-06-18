<template lang="pug">
q-item.app-search__result(
  :id="entry.id"
  :active="active"
  clickable
  @click="entry.onClick"
  @mouseenter="entry.onMouseenter"
)
  q-item-section
    .app-search__result-overlay {{ entry.path }}
    .app-search__result-main
      span(
        v-for="(item, index) in entry.content"
        :key="index"
        :class="item.class"
      ) {{ item.str }}

  slot
</template>

<script>
import { parseContent } from './results-utils'

export default {
  name: 'ResultPageContent',
  props: { entry: Object, active: Boolean },

  extractProps (hit) {
    const title = [
      hit.menu !== void 0 ? hit.menu.join(' » ') : null,
      [ hit.l1, hit.l2, hit.l3, hit.l4, hit.l5, hit.l6 ].filter(e => e).join(' » ')
    ].filter(e => e).join(' | ')

    return {
      path: title || hit.group,
      content: parseContent(hit._formatted.content)
    }
  }
}
</script>
