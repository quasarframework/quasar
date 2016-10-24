<template>
  <div>
    <div class="layout-padding">
      <p class="caption">Please scroll down to see the image and Scroll Fire being called with a nice Velocity effect.</p>
      <p v-for="n in 6">{{loremipsum}}</p>

      <p class="caption">Scroll Fire below. Reload page to see the effect again.</p>
      <p class="text-center">
        <img v-scroll-fire="bounceImage" :src="'statics/quasar.jpg'" style="width: 200px">
      </p>

      <p v-for="n in 3">{{loremipsum}}</p>
    </div>
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
    bounceImage (element) {
      Velocity(element, 'fadeOut', {duration: 1000})
      Velocity(element, 'fadeIn', {delay: 300, duration: 1000})
    }
  }
}
</script>
