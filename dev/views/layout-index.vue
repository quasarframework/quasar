<template>
  <div>
    <quasar-search :model.sync="search"></quasar-search>
    <quasar-search :model.sync="search" class="purple" :disabled="true"></quasar-search>
    <quasar-search :model.sync="search" class="red"></quasar-search>
    <quasar-search :model.sync="search" class="dark"></quasar-search>

    <div class="layout-padding">
      <h1>Hello</h1>
      <div v-for="n in 100">text</div>
    </div>
    <quasar-parallax src="statics/parallax1.jpg" :height="200">
      <div slot="loading">Loading...</div>
      <h1>Parallax</h1>
    </quasar-parallax>
    <div class="layout-padding">
      <div v-for="n in 100">text</div>
    </div>
    <quasar-fab class="absolute-bottom-right" type="primary" direction="up">
      <quasar-small-fab label="first" class="tertiary">mail</quasar-small-fab>
      <quasar-small-fab label="second" class="secondary">alarm</quasar-small-fab>
    </quasar-fab>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: ''
    }
  }
}
</script>
