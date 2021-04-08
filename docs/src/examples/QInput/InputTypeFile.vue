<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <!--
        Due to browser security policy,
        we can only read the value, but not
        write to it, so we only have an @update:model-value listener
      -->

      <q-input
        @update:model-value="val => { file = val[0] }"
        filled
        type="file"
        hint="Native file"
      />

      <q-input
        @update:model-value="val => { files = val }"
        multiple
        filled
        type="file"
        hint="Native file (multiple)"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      file: ref(null),
      files: ref(null)
    }
  }
}
</script>
