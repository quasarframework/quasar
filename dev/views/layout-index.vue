<template>
  <div v-for="n in 100">text</div>
  <quasar-parallax src="statics/parallax1.jpg" :height="200">
    <div slot="loading">Loading...</div>
    <h1>Parallax</h1>
  </quasar-parallax>
  <div v-for="n in 100">text</div>
</template>

<script>
export default {}
</script>
