<template>
  <div>
    <div class="layout-padding">
      <input type="text" v-model="url" />
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
