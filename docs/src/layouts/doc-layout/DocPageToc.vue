<template>
  <div ref="rootRef" class="doc-page__toc">
    <a
      v-for="tocItem in docStore.state.value.toc"
      :key="tocItem.id"
      :id="`toc--${tocItem.id}`"
      :href="`#${tocItem.id}`"
      class="doc-item"
      :class="tocItem.sub ? 'doc-page__toc--sub' : ''"
      @click.prevent="tocItem.onClick"
    >
      {{ tocItem.title }}
    </a>
  </div>
</template>

<script setup>
import { onMounted, useTemplateRef, watch } from 'vue'
import { useDocStore } from './store/index.js'

const docStore = useDocStore()
const rootRef = useTemplateRef('rootRef')

// the active entry is marked on the DOM, not in the template: the server
// cannot know the hash the page opens on, so a rendered class would
// mismatch on hydration, and a scroll would re-render the whole list
if (import.meta.env.QUASAR_CLIENT) {
  let activeEl = null

  onMounted(() => {
    watch(
      [() => docStore.state.value.toc, () => docStore.state.value.activeToc],
      ([, id]) => {
        activeEl?.classList.remove('doc-item--active')
        activeEl =
          id !== null ? rootRef.value.querySelector(`[id="toc--${id}"]`) : null
        activeEl?.classList.add('doc-item--active')
        // a long TOC scrolls on its own: keep the active entry in its view
        activeEl?.scrollIntoView({ block: 'nearest' })
      },
      { immediate: true, flush: 'post' }
    )
  })
}
</script>
