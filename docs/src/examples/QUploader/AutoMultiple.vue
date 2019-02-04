<template>
  <div class="q-pa-md q-gutter-sm">
    <q-uploader
      url="http://localhost:4444/upload"
      label="Auto upload"
      bordered
      multiple
      auto-upload
    />
    <q-uploader
      url="http://localhost:4444/upload"
      label="Batch upload (min 5 files)"
      bordered
      multiple
      :batch="(files) => files.length >= 5"
    />
  </div>
</template>
