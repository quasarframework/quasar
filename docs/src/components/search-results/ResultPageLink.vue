<template lang="pug">
q-item.app-search__result(
  :id="entry.id"
  :active="active"
  clickable
  @click="entry.onClick"
  @mouseenter="entry.onMouseenter"
)
  q-item-section
    .app-search__result-content {{ entry.content }}

  slot
</template>

<script>
export default {
  name: 'ResultPageLink',
  props: { entry: Object, active: Boolean },

  extractProps (hit) {
    return {
      content: [ hit.l0, hit.l1, hit.l2, hit.l3, hit.l4, hit.l5 ].filter(e => e).join(' » ')
    }
  }
}
</script>
