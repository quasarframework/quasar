<template>
  <div class="q-pa-md">
    <q-slider
      v-model="value"
      :min="-20"
      :max="20"
      :step="4"
      label
      :label-value="'Value: ' + value + 'px'"
      label-always
      color="purple"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: -10
    }
  }
}
</script>
