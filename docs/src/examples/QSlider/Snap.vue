<template>
  <div class="q-pa-md">
    <q-badge color="secondary">
      Model: {{ value }} (-20 to 20)
    </q-badge>

    <q-slider
      v-model="value"
      :min="-20"
      :max="20"
      :step="4"
      snap
      label
      label-always
      color="purple"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: 0
    }
  }
}
</script>
