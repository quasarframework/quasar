<template>
  <div class="q-pa-md q-gutter-sm">
    <q-uploader
      url="http://localhost:4444/upload"
      label="Multiple files"
      bordered
      multiple
    />
    <div>In the following example, only images will be displayed in the selection.</div>
    <q-uploader
      url="http://localhost:4444/upload"
      label="Restricted to images"
      bordered
      multiple
      accept=".jpg, image/*"
    />
    <q-uploader
      url="http://localhost:4444/upload"
      label="Max file size (2k)"
      bordered
      multiple
      :max-file-size="2048"
    />
    <q-uploader
      url="http://localhost:4444/upload"
      label="Max upload size (4k)"
      bordered
      multiple
      :max-total-size="4096"
    />
    <q-uploader
      url="http://localhost:4444/upload"
      label="No thumbnails"
      bordered
      multiple
      no-thumbnails
    />
  </div>
</template>
