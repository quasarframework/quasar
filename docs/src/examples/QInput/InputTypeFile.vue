<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <!--
        Due to browser security policy,
        we can only read the value, but not
        write to it, so we only have an @input listener
      -->

      <q-input
        @input="val => { file = val[0] }"
        filled
        type="file"
        hint="Native file"
      />

      <q-input
        @input="val => { files = val }"
        multiple
        filled
        type="file"
        hint="Native file (multiple)"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      file: null,
      files: null
    }
  }
}
</script>
