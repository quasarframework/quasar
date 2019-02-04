<template>
  <div class="q-pa-md q-gutter-sm">
    <q-uploader
      url="http://localhost:4444/upload"
      label="Filtered (for <2k size)"
      bordered
      multiple
      :filter="(files) => files.filter(checkFileSize)"
    />
    <q-uploader
      url="http://localhost:4444/upload"
      label="Filtered (png only)"
      bordered
      multiple
      :filter="(files) => files.filter(checkFileType)"
    />
  </div>
</template>

<script>
export default {
  methods: {
    checkFileSize (file) {
      return file.size < 2048
    },

    checkFileType (file) {
      return file.type === 'image/png'
    }
  }
}
</script>
