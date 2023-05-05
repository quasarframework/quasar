<template>
  <q-scroll-area class="app-stack">
    <q-list separator >
      <q-item
        v-for="(entry, index) of data.stack"
        :key="index"
        clickable
        class="app-stack__entry text-primary"
        :class="stackMeta[index].class"
        @click="stackMeta[index].onClick"
      >
        <q-item-section>
          <div>
            <span class="app-stack__entry-fn">{{ entry.functionName }}</span>
            <span class="app-stack__entry-as q-mx-xs text-no-wrap">as</span>
            <span class="app-stack__entry-method-name">{{ entry.methodName }}</span>
          </div>
          <div class="q-mt-xs">
            <span class="app-stack__entry-file">{{ entry.fileName }}</span>
            <span v-if="entry.native" class="app-stack__entry-native q-ml-xs text-no-wrap">[native]</span>
          </div>
          <div class="app-stack__entry-line text-no-wrap">
            ({{ entry.lineNumber }}<span v-if="entry.columnNumber !== null">:{{ entry.columnNumber }}</span>)
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>
</template>

<script setup>
import { computed } from 'vue'

import data from 'src/assets/data.js'
import store from 'src/assets/store.js'

const stackMeta = computed(() => data.stack.map((_, index) => ({
  class: store.value.selectedStackEntryIndex === index ? 'app-stack__entry--selected' : '',
  onClick: () => { store.value.selectedStackEntryIndex = index }
})))
</script>

<style lang="sass">
.app-stack
  position: sticky
  top: 0
  background-color: #fff
  width: 30%
  min-width: 200px
  max-width: 500px
  word-break: break-all
  height: 100vh
  max-height: 100vh

  &__entry-fn
    color: $primary
    font-weight: bold

  &__entry-as,
  &__entry-method-name,
  &__entry-native
    color: $dark

  &__entry-method-name
    font-weight: bold

  &__entry-as,
  &__entry-file
    color: $floating-rock

  &__entry-line
    color: $primary
    font-weight: bold

  &__entry-native
    font-weight: bold

  &__entry
    padding: 16px

    &--selected
      background-color: rgba($primary, .2)
</style>
