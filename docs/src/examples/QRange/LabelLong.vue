<template>
  <div class="q-pa-md">
    <q-range
      v-model="model"
      :min="-20"
      :max="20"
      :step="4"
      :left-label-value="'Value: ' + model.min + 'px'"
      :right-label-value="'Value: ' + model.max + 'px'"
      label-always
      color="purple"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: {
        min: -16,
        max: 12
      }
    }
  }
}
</script>
