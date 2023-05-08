<template>
  <div class="q-pa-md">
    <q-uploader
      url="http://localhost:4444/upload"
      :headers="[{name: 'X-Custom-Timestamp', value: 1550240306080}]"
      style="max-width: 300px"
    />
  </div>
</template>
