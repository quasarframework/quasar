<template>
  <div class="q-pa-md">
    <p class="text-weight-bold">
      Please scroll down to see the image have a short bounce effect
      when being visible for first time.
    </p>
    <p v-for="n in 10" :key="n">{{ loremipsum }}</p>

    <p>Scroll Fire below. Reload page to see the bounce effect again.</p>
    <p class="text-center">
      <img
        v-scroll-fire="bounceImage"
        src="https://cdn.quasar.dev/logo-v2/svg/logo.svg"
        style="width: 100px; height: 100px;"
      >
    </p>

    <p>{{ loremipsum }}</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loremipsum: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    }
  },

  methods: {
    bounceImage (el) {
      // in this example, when the `<div>` comes into view,
      // we bounce it for 2 seconds

      el.classList.add('animate-bounce')

      setTimeout(() => {
        // we make sure the node is still in DOM
        // (user hasn't navigated away from the Vue component
        // rendering our `<div>`)
        // so we don't generate an error
        if (document.body.contains(el)) {
          // then remove the helper class to
          // stop bouncing
          el.classList.remove('animate-bounce')
        }
      }, 2000)
    }
  }
}
</script>

<style lang="sass" scoped>
.animate-bounce
  animation: q-bounce 2s infinite

@keyframes q-bounce
  0%, 20%, 50%, 80%, 100%
    transform: translateY(0)
  40%
    transform: translateY(-30px)
  60%
    transform: translateY(-15px)
</style>
