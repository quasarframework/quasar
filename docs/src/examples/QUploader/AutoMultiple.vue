<template>
  <div>
    <div class="q-layout-padding">
      <div class="q-gutter-sm">
        <q-uploader class="q-mb-lg" label="Auto Uploader" auto url="http://localhost:4444/upload" />
        <q-uploader label="Multiple File Uploader" multiple url="http://localhost:4444/upload" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    onChange (val) {
      console.log('@change', JSON.stringify(val))
    },
    onInput (val) {
      console.log('@input', JSON.stringify(val))
    }
  }
}
</script>
