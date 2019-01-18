<template>
  <div class="q-pa-md flex flex-center">
    <q-knob
      :step="10"
      v-model="value"
      show-value
      size="90px"
      :thickness="0.22"
      color="lime"
      track-color="lime-3"
      class="text-lime q-ma-md"
    />

    <q-knob
      :step="25"
      v-model="value"
      show-value
      size="90px"
      :thickness="0.22"
      color="orange"
      track-color="orange-3"
      class="text-orange q-ma-md"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: 61
    }
  }
}
</script>
