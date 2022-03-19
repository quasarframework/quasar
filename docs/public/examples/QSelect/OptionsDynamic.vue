<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-select
      filled
      v-model="model"
      multiple
      :options="options"
      :loading="loading"
      @virtual-scroll="onScroll"
    />
  </div>
</template>

<script>
import { ref, computed, nextTick } from 'vue'

const allOptions = []
for (let i = 0; i <= 100000; i++) {
  allOptions.push('Opt ' + i)
}

const pageSize = 50
const lastPage = Math.ceil(allOptions.length / pageSize)

export default {
  setup () {
    const loading = ref(false)
    const nextPage = ref(2)
    const options = computed(() => allOptions.slice(0, pageSize * (nextPage.value - 1)))

    return {
      model: ref(null),
      loading,

      nextPage,
      options,

      onScroll ({ to, ref }) {
        const lastIndex = options.value.length - 1

        if (loading.value !== true && nextPage.value < lastPage && to === lastIndex) {
          loading.value = true

          setTimeout(() => {
            nextPage.value++
            nextTick(() => {
              ref.refresh()
              loading.value = false
            })
          }, 500)
        }
      }
    }
  }
}
</script>
