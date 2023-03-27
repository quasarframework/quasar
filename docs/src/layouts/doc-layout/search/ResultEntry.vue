<template>
  <q-item
    class="app-search__result"
    :id="props.entry.id"
    :active="props.active"
    clickable
    active-class="app-search__result--active"
    @click.prevent.stop="props.entry.onClick"
    @mouseenter="props.entry.onMouseenter"
  >
    <q-item-section>
      <div class="app-search__result-title row items-center q-gutter-sm">
        <div class="doc-token">{{ props.entry.page }}</div>
        <div v-if="props.entry.section">{{ props.entry.section }}</div>
      </div>
      <div v-if="props.entry.content" class="app-search__result-content">
        <span
          v-for="(item, index) in props.entry.content"
          :key="index"
          :class="item.class"
        >{{ item.str }}</span>
      </div>
    </q-item-section>

    <div v-if="props.active" class="absolute-right row items-center q-pr-sm">
      <kbd><q-icon :name="mdiKeyboardReturn" /></kbd>
    </div>
  </q-item>
</template>

<script setup>
import { mdiKeyboardReturn } from '@quasar/extras/mdi-v7'

const props = defineProps({
  entry: Object,
  active: Boolean
})
</script>
