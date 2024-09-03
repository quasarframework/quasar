<template>
  <div>
    <div class="q-layout-padding">
      <q-toggle v-model="disable" label="Directive disabled" />
      <p class="caption">
        Please scroll down to see the image have a short bounce effect when being visible for first time.
      </p>
      <p v-for="n in 15" :key="'a_' + n">
        {{ n }} {{ loremipsum }}
      </p>

      <p class="caption">
        Scroll Fire below. Reload page to see the bounce effect again.
      </p>
      <p class="text-center">
        <img v-scroll-fire="computedBounceImage" src="~assets/quasar.jpg" style="width: 200px">
      </p>

      <p v-for="n in 15" :key="'b_' + n">
        {{ n }} {{ loremipsum }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      disable: false,
      loremipsum: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    }
  },

  computed: {
    computedBounceImage () {
      return this.disable === true ? void 0 : this.bounceImage
    }
  },

  methods: {
    bounceImage (el) {
      el.classList.add('animate-bounce')
      setTimeout(() => {
        if (document.body.contains(el)) {
          el.classList.remove('animate-bounce')
        }
      }, 2000)
    }
  }
}
</script>

<style lang="sass">
.animate-bounce
  animation: q-bounce 2s infinite /* rtl:ignore */

@keyframes q-bounce
  0%, 20%, 50%, 80%, 100%
    transform: translateY(0)
  40%
    transform: translateY(-30px)
  60%
    transform: translateY(-15px)
</style>
