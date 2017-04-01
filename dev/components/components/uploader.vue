<template>
  <div>
    <div class="layout-padding">
      <q-input v-model="url" />
      <p class="caption">Single File Upload</p>
      <q-uploader :url="url" />
      <p class="caption">Multiple File Upload</p>
      <q-uploader multiple :url="url" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      url: 'http://1.1.1.195/upload.php'
    }
  }
}
</script>
