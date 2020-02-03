<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-file
        v-model="files"
        label="Pick files"
        filled
        counter
        multiple
        style="max-width: 300px"
      />

      <q-file
        v-model="files"
        label="Pick files"
        filled
        counter
        max-files="3"
        multiple
        style="max-width: 300px"
      />
    </div>
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
