<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm row items-start">
      <q-uploader
        url="http://localhost:4444/upload"
        label="Individual upload"
        multiple
        style="max-width: 300px"
      />

      <q-uploader
        url="http://localhost:4444/upload"
        label="Batch upload"
        multiple
        batch
        style="max-width: 300px"
      />
    </div>
  </div>
</template>
