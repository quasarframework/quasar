<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-checkbox
        v-model="customModel"
        color="secondary"
        label="Do you agree with the terms & conditions?"
        true-value="yes"
        false-value="no"
      />
    </div>

    <div class="q-px-sm">
      The model data: <strong>'{{ customModel }}'</strong>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      customModel: 'no'
    }
  }
}
</script>
