<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-uploader
        url="http://localhost:4444/upload"
        label="Restricted to images"
        multiple
        accept=".jpg, image/*"
        style="max-width: 300px"
      />

      <q-uploader
        url="http://localhost:4444/upload"
        label="Max file size (2k)"
        multiple
        :max-file-size="2048"
        style="max-width: 300px"
      />

      <q-uploader
        url="http://localhost:4444/upload"
        label="Max total upload size (4k)"
        multiple
        :max-total-size="4096"
        style="max-width: 300px"
      />
    </div>
  </div>
</template>
