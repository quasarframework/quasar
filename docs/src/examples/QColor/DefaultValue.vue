<template>
  <div class="q-pa-md">
    <q-color
      v-model="nullModel"
      default-value="#285de0"
      style="max-width: 250px"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      nullModel: ref(null)
    }
  }
}
</script>
