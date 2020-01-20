<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-file
        v-model="filesMaxSize"
        filled
        label="Filtered (for <2k size)"
        multiple
        :filter="checkFileSize"
        style="max-width: 300px"
      />

      <q-file
        v-model="filesPng"
        rounded
        outlined
        label="Filtered (png only)"
        multiple
        :filter="checkFileType"
        style="max-width: 300px"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      filesMaxSize: null,
      filesPng: null
    }
  },

  methods: {
    checkFileSize (files) {
      return files.filter(file => file.size < 2048)
    },

    checkFileType (files) {
      return files.filter(file => file.type === 'image/png')
    }
  }
}
</script>
