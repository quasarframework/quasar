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
    this.url = 'https://sibforms.com/serve/MUIEAEDFbXuZGDn5sOlNHS0o73EmiAjGmXr8wd6BaBUFgqAfL-fZKS5uuLpMUom-kuPYJCOG0gTJvHX19cW4Yn60PIS8MKjVlf6jVtfgDgUs9tftbUddH7rQvK-X1KZrxvzDwQDObsDqGa8bzpYV7dOSfevMBzxz31rCauibV2VxSuWoRg1D0d_y0EmmUkGLVXBVyrxTpZjKsPmm'
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
