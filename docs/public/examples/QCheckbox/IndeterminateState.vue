<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-checkbox indeterminate-value="maybe" v-model="theModel2" label="Did you eat lunch today?" />
    </div>

    <div class="q-px-sm">
      The model data: <strong>{{ JSON.stringify(theModel2) }}</strong>
    </div>

    <div class="q-gutter-sm">
      <q-checkbox toggle-indeterminate v-model="theModel" label="Did you eat lunch today?" />
    </div>

    <div class="q-px-sm row no-wrap items-center">
      <div class="col">
        The model data: <strong>{{ JSON.stringify(theModel) }}</strong>
      </div>
      <q-btn color="primary" label="Reset" @click="onResetClick" class="q-ml-md" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const theModel = ref(null)
    const theModel2 = ref('maybe')

    return {
      theModel,
      theModel2,

      onResetClick () {
        theModel.value = null
        theModel2.value = 'maybe'
      }
    }
  }
}
</script>
