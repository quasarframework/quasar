<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm row items-start">
      <q-uploader
        url="http://localhost:4444/upload"
        style="max-width: 300px"
      >
        <template v-slot:error-icon="file">
          <q-icon name="error" style="font-size: 32px;" class="text-red q-mr-md" />
        </template>
      </q-uploader>

      <q-uploader
        url="http://localhost:4444/upload"
        color="teal"
        flat
        bordered
        style="max-width: 300px"
      >
        <template v-slot:error-icon="file">
          <q-icon name="fas fa-bomb" style="font-size: 32px;" class="q-mr-md" />
        </template>
      </q-uploader>

    </div>
  </div>
</template>
