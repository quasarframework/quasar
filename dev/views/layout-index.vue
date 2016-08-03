<template>
  <div>
    <div v-for="n in 100">text</div>
    <quasar-parallax src="statics/parallax1.jpg" :height="200">
      <div slot="loading">Loading...</div>
      <h1>Parallax</h1>
    </quasar-parallax>
    <div v-for="n in 100">text</div>
    <quasar-fab class="absolute-bottom-right" type="primary" direction="up">
      <quasar-small-fab label="first" class="tertiary">mail</quasar-small-fab>
      <quasar-small-fab label="second" class="secondary">alarm</quasar-small-fab>
    </quasar-fab>
  </div>
</template>

<script>
export default {}
</script>
