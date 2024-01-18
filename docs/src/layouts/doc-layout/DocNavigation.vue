<template>
  <q-dialog v-model:model-value="show" seamless position="top" >
    <q-card class="navigation">
      <q-form @submit="navigative" class="full-width">
        <q-select
          class="full-width"
          filled
          @update:model-value="navigative"
          @blur="show = false"
          use-input
          input-debounce="0"
          hide-selected
          autofocus
          placeholder="Search page by path"
          :options="options"
          @filter="filterFn"
          style="width: 250px"
        >
        </q-select>
      </q-form>
    </q-card>
</q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { useRouter } from 'vue-router'

const show = ref(false)
const router = useRouter()
const allRoutes = router.getRoutes().map((r) => r.path)
const options = ref(allRoutes)

onMounted(() => {
  window.addEventListener('keydown', (event) => {
    if (event.key === 'p' && event.metaKey) {
      event.preventDefault()
      show.value = true
    }
  })
})

function navigative (val) {
  router.push(val)
  show.value = false
}

function filterFn (val, update) {
  if (val === '') {
    update(() => {
      options.value = allRoutes
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    options.value = allRoutes.filter(v => v.toLowerCase().indexOf(needle) > -1)
  })
}
</script>


<style scoped>
.navigation{
  width: 70vw;
}
</style>
