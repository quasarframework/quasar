<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-uploader
        url="http://localhost:4444/upload"
        label="Filtered (for <2k size)"
        multiple
        :filter="checkFileSize"
        style="max-width: 300px"
      />

      <q-uploader
        url="http://localhost:4444/upload"
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
