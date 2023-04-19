<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-btn color="primary" @click="showing = true" label="Show"/>
      <q-btn color="primary" @click="showing = false" label="Hide"/>
    </div>

    <div
      style="width: 200px; height: 70px;"
      class="bg-purple text-white rounded-borders row flex-center q-mt-md"
    >
      Hover here or click buttons
      <q-tooltip v-model="showing">Tooltip text</q-tooltip>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      showing: ref(false)
    }
  }
}
</script>
