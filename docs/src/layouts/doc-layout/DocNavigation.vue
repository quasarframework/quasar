<template>
  <q-dialog v-model:model-value="docStore.state.value.quicklyNavigation" seamless position="top" >
    <q-card class="navigation">
      <q-form @submit="navigative" class="full-width">
        <q-select
          class="full-width"
          filled
          @update:model-value="navigative"
          @blur="docStore.closeQuicklyNavigation"
          use-input
          input-debounce="0"
          hide-selected
          autofocus
          dense
          options-dense
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
import { useDocStore } from './store'

const router = useRouter()
const allRoutes = router.getRoutes().map((r) => r.path)
const options = ref(allRoutes)

const docStore = useDocStore()

onMounted(() => {
  window.addEventListener('keydown', (event) => {
    if (event.key === 'p' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      docStore.openQuicklyNavigation()
    }
  })
})

function navigative (val) {
  router.push(val)
  docStore.closeQuicklyNavigation()
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
