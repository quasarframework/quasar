<template>
  <div class="q-pa-md">
    <div class="text-caption q-mb-md">
      <div>
        Click inside the card to arm the shortcuts (it gets a colored border
        while it has the focus).
      </div>
      <div class="q-mt-md">
        <kbd>j</kbd> / <kbd>k</kbd> move the highlight, but type as text while
        the filter field has the focus; the arrows move it from anywhere in the
        card. <kbd>Enter</kbd> selects the highlighted item, <kbd>/</kbd>
        focuses the filter.
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-7">
        <q-card
          ref="regionRef"
          class="doc-shortcut-region"
          flat
          bordered
          tabindex="-1"
        >
          <q-card-section class="row items-center no-wrap">
            <q-input
              ref="filterRef"
              class="col"
              v-model="filter"
              dense
              outlined
              placeholder="Filter (press / to get here)"
            />

            <div class="q-pl-sm text-caption"> Selected: {{ selected }} </div>
          </q-card-section>

          <q-separator />

          <q-list dense padding>
            <q-item
              v-for="(item, index) in filtered"
              :key="item"
              clickable
              :active="index === highlighted"
              active-class="bg-primary text-white"
              @click="select(index)"
            >
              <q-item-section>{{ item }}</q-item-section>
            </q-item>
            <q-item v-if="filtered.length === 0">
              <q-item-section class="text-grey">No match</q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <div class="col-12 col-sm-5">
        <q-input
          v-model="outside"
          outlined
          dense
          label="Outside the region"
          hint="The same keys do nothing here"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, useTemplateRef, watch } from 'vue'
import { useKeyboardShortcut } from 'quasar'

const regionRef = useTemplateRef('regionRef')
const filterRef = useTemplateRef('filterRef')

const items = [
  'Apples',
  'Bananas',
  'Cherries',
  'Dates',
  'Elderberries',
  'Figs',
  'Grapes'
]

const filter = ref('')
const outside = ref('')
const highlighted = ref(0)
const selected = ref('none')

const filtered = computed(() =>
  items.filter(item => item.toLowerCase().includes(filter.value.toLowerCase()))
)

watch(filtered, () => {
  highlighted.value = 0
})

function move(delta) {
  const count = filtered.value.length
  if (count !== 0) {
    highlighted.value = (highlighted.value + delta + count) % count
  }
}

function select(index) {
  highlighted.value = index
  selected.value = filtered.value[index] ?? 'none'
  // the card keeps the focus, so that a clicked item's own Enter
  // handling does not compete with the shortcut
  regionRef.value.$el.focus()
}

const options = { target: regionRef }
const moveOptions = { target: regionRef, repeat: true }

useKeyboardShortcut(['ArrowDown', 'j'], () => move(1), moveOptions)
useKeyboardShortcut(['ArrowUp', 'k'], () => move(-1), moveOptions)
useKeyboardShortcut('Enter', () => select(highlighted.value), options)
useKeyboardShortcut('/', () => filterRef.value.focus(), options)
</script>

<style lang="sass">
.doc-shortcut-region
  outline: none
  transition: border-color .2s, box-shadow .2s

  &:focus-within
    border-color: var(--q-primary)
    box-shadow: 0 0 0 1px var(--q-primary)
</style>
