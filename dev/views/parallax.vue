<template>
  <h1>Parallax</h1>

  <p v-for="n in 7" class="par-text">{{loremipsum}}</p>

  <quasar-parallax src="statics/parallax1.jpg" :height="200">
    <div slot="loading">Loading...</div>
    <h1>Parallax</h1>
  </quasar-parallax>

  <p v-for="n in 7" class="par-text">{{loremipsum}} CHOP!!!!</p>

  <quasar-parallax src="statics/parallax2.jpg">
    <div slot="loading">Loading...</div>
    <h1>Parallax</h1>
  </quasar-parallax>

  <p v-for="n in 7" class="par-text">{{loremipsum}}</p>

  <quasar-parallax src="statics/parallax1.jpg">
    <div slot="loading">Loading...</div>
    <h1>Parallax</h1>
  </quasar-parallax>

  <p v-for="n in 7" class="par-text">{{loremipsum}}</p>

  <quasar-parallax src="statics/mountains.jpg" :height="200">
    <div slot="loading">Loading...</div>
    <h1>Parallax</h1>
  </quasar-parallax>

  <p v-for="n in 7" class="par-text">{{loremipsum}}</p>
</template>

<script>
export default {
  data () {
    return {
      loremipsum: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    }
  }
}
</script>
