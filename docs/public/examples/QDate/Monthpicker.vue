<template>
  <div class="q-pa-md">
    <div>Date Model: {{ date }}</div>
    <q-date v-model="date" years-in-month-view default-view="Months" emit-immediately
      @update:model-value="onUpdateMv"
      :key="dpKey" minimal mask="YYYY/MM" />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const date = ref('2022/02')
    const dpKey = ref(Date.now())

    function onUpdateMv (v) {
      dpKey.value = Date.now()
    }
    return {
      dpKey,
      onUpdateMv,
      date
    }
  }
}
</script>
