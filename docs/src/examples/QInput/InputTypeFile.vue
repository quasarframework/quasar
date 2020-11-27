<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <!--
        Due to browser security policy,
        we can only read the value, but not
        write to it, so we only have an @update:modelValue listener
      -->

      <q-input
        @update:modelValue="val => { file = val[0] }"
        filled
        type="file"
        hint="Native file"
      />

      <q-input
        @update:modelValue="val => { files = val }"
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
