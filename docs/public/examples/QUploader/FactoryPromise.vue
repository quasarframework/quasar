<template>
  <div class="q-pa-md">
    <q-uploader
      :factory="factoryFn"
      multiple
      style="max-width: 300px"
    />
  </div>
</template>

<script>
export default {
  methods: {
    factoryFn (files) {
      // returning a Promise

      return new Promise((resolve) => {
        // simulating a delay of 2 seconds
        setTimeout(() => {
          resolve({
            url: 'http://localhost:4444/upload'
          })
        }, 2000)
      })
    }
  }
}
</script>
