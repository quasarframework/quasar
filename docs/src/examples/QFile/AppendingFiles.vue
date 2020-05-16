<template>
  <div class="q-pa-md">
    <q-file
      v-model="files"
      label="Pick files"
      filled
      multiple
      append
      style="max-width: 300px"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      files: null
    }
  }
}
</script>
