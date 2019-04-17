<template>
  <div class="q-pa-md">
    <!--
      Due to browser security policy,
      we can only read the value, but not
      write to it, so we only have an @input listener
    -->
    <q-input
      @input="val => { file = val }"
      filled
      type="file"
      hint="Native file"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      file: null
    }
  }
}
</script>
