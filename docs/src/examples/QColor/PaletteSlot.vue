<template>
  <div class="q-pa-md">
    <q-badge color="grey-3" text-color="black" class="q-mb-sm">
      {{ hex }}
    </q-badge>

    <q-color
      v-model="hex"
      default-view="palette"
      :palette="palleteOptions"
      class="my-picker"
    >
      <template #palette="{ palette, select, editable }">
        <div
          class="row q-gutter-sm q-pa-md"
          role="group"
          aria-label="Brand colors"
        >
          <q-btn
            v-for="color in palette"
            :key="color"
            no-caps
            :outline="hex !== color"
            :unelevated="hex === color"
            :disable="!editable"
            :aria-pressed="hex === color"
            @click="select(color)"
          >
            <span class="swatch q-mr-sm" :style="{ backgroundColor: color }" />
            {{ swatches[color] }}
          </q-btn>
        </div>
      </template>
    </q-color>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const swatches = {
  '#019a9d': 'Teal',
  '#d9b801': 'Mustard',
  '#e8045a': 'Raspberry',
  '#b2028a': 'Magenta',
  '#2a0449': 'Indigo',
  '#1f3a93': 'Navy',
  '#2e7d32': 'Forest'
}

const hex = ref('#019a9d')
const palleteOptions = Object.keys(swatches)
</script>

<style lang="sass" scoped>
.my-picker
  max-width: 350px

.swatch
  display: inline-block
  width: 1em
  height: 1em
  border-radius: 2px
  border: 1px solid rgba(0, 0, 0, .2)
</style>
