<template>
  <div class="q-pa-md">
    <div class="row items-start q-gutter-md">
      <q-color
        v-model="color"
        disable
        class="my-picker"
      />

      <q-color
        v-model="color"
        readonly
        class="my-picker"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      color: ref('#ff00ff')
    }
  }
}
</script>

<style lang="sass" scoped>
.my-picker
  max-width: 250px
</style>
