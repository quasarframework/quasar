<template>
  <div class="q-layout-padding">
    <h5>Title of document should be "Test End"</h5>
  </div>
</template>

<script>
import { useMeta } from 'quasar'
import { ref, onMounted } from 'vue'

export default {
  setup () {
    console.log('init')

    const title = ref('Test Start')

    useMeta(() => {
      console.log('running meta fn in title.vue', title.value)
      return {
        title: title.value
      }
    })

    onMounted(() => {
      title.value = 'Test End'
    })
  }
}
</script>
