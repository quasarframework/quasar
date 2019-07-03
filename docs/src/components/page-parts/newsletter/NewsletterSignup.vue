<template lang="pug">
iframe.newsletter-signup(
  width="540"
  height="505"
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
    this.url = 'https://sibforms.com/serve/MUIEACnh32O4Z86KTHIgIEvDLZcePEOj4VjDves7rQLmnzjOtXt7RrjeHT233EEjw2wT2Ifj_eGOTq48NXbW6mS9eOhaRG6rFMS4pf00KHxIiG0dNGSriXcietfuo9GTfYPz2k3PktHwJ_AP1kHgF9Tfv0ODnE1SqtndDhyoB6LJ_0xabjKBUov6pcGIjRmpJiK5FMGs-o6O3DO2'
  }
}
</script>

<style lang="stylus">
.newsletter-signup
  display block
  margin-left -53px
  max-width 100%

  @media (max-width 600px)
    margin-left -32px
</style>
