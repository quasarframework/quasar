<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm row items-start">
      <q-uploader
        url="http://localhost:4444/upload"
        style="max-width: 300px"
      />

      <q-uploader
        url="http://localhost:4444/upload"
        color="teal"
        flat
        bordered
        style="max-width: 300px"
      />

      <q-uploader
        url="http://localhost:4444/upload"
        label="Upload files"
        color="purple"
        square
        flat
        bordered
        style="max-width: 300px"
      />

      <q-uploader
        url="http://localhost:4444/upload"
        label="No thumbnails"
        color="amber"
        text-color="black"
        no-thumbnails
        style="max-width: 300px"
      />
    </div>
  </div>
</template>
