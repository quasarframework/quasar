<template>
<div>
  <q-select
    v-model="item"
    outlined
    use-input
    hide-selected
    fill-input
    placeholder="Names of Quasar components, directives or plugins"
    input-debounce="0"
    :options="options"
    clearable
    options-dense
    virtual-scroll-slice-size="50"
    @filter="filterFn"
  >
    <template #prepend>
      <q-icon name="travel_explore" />
    </template>
  </q-select>

  <doc-api
    v-if="item"
    ref="apiRef"
    :key="item"
    :file="item"
    page-link
  />
</div>
</template>

<script setup>
import { ref } from 'vue'
import apiList from 'quasar/dist/transforms/api-list.json'

import DocApi from 'src/components/DocApi.vue'

const item = ref('')
const options = ref(apiList)

function filterFn (val, update) {
  update(() => {
    const needle = val.toLowerCase()
    options.value = apiList.filter(v => v.toLowerCase().indexOf(needle) > -1)
  })
}
</script>
