<template>
  <q-item
    class="app-search__result"
    :id="props.entry.id"
    :active="props.active"
    clickable
    active-class="doc-layout__item--active"
    @click="props.entry.onClick"
    @mouseenter="props.entry.onMouseenter"
  >
    <q-item-section side class="app-search__result-icon">
      <kbd v-if="props.active">
        <q-icon :name="mdiKeyboardReturn" />
      </kbd>
      <q-icon v-else :name="icon" />
    </q-item-section>

    <q-item-section>
      <template v-if="props.entry.content">
        <div class="app-search__result-overlay">{{ props.entry.path }}</div>
        <div class="app-search__result-main">
          <span
            v-for="(item, index) in props.entry.content"
            :key="index"
            :class="item.class"
          >{{ item.str }}</span>
        </div>
      </template>

      <div v-else class="app-search__result-main">{{ props.entry.path }}</div>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { computed } from 'vue'
import { mdiFolderPoundOutline, mdiFolderTextOutline, mdiKeyboardReturn } from '@quasar/extras/mdi-v7'

const props = defineProps({
  entry: Object,
  active: Boolean
})

const icon = computed(() => props.entry.content !== void 0 ? mdiFolderTextOutline : mdiFolderPoundOutline)
</script>
