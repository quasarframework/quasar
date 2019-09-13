<template lang="pug">
iframe.newsletter-signup(
  width="100%"
  height="600"
  :src="url"
  frameborder="0"
  scrolling="auto"
  allowfullscreen
)
</template>

<script>
export default {
  name: 'NewsletterSignup',

  created () {
    this.url = 'https://newsletter.quasar.dev'
  }
}
</script>

<style lang="sass">
.newsletter-signup
  display: block
  max-width: 100%
</style>
