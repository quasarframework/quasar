<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-checkbox toggle-indeterminate indeterminate-value="maybe" v-model="theModel" label="Did you eat lunch today?" />
    </div>

    <div class="q-px-sm">
      The model data: <strong>'{{ theModel }}'</strong>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      theModel: false
    }
  }
}
</script>
