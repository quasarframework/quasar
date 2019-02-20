<template>
  <div id="q-app">
    <router-view />

    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      mode="out-in"
      :duration="200"
    >
      <q-banner
        v-if="showCookieMessage"
        class="bg-primary fixed-bottom z-top"
      >
        <div class="row justify-between items-center">
          <div class="text-white">
            <span>This website uses cookies to ensure you get the best experience on our website. </span>
            <a href="https://cookiesandyou.com" rel="noopener noreferrer nofollow" target="_blank" class="text-white">Learn more</a>
          </div>
          <q-btn
            label="Got it!"
            color="white"
            text-color="black"
            @click="hideCookieNotification"
          />
        </div>
      </q-banner>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',

  data () {
    return {
      showCookieMessage: false
    }
  },

  methods: {
    hideCookieNotification () {
      this.showCookieMessage = false
      this.$q.cookies.set('q_cookie_notification', '1')
    }
  },

  created () {
    setTimeout(() => {
      this.showCookieMessage = !this.$q.cookies.has('q_cookie_notification')
    }, 3000)
  }
}
</script>
