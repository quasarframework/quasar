<template>
  <p class="caption">Please scroll down to see the images</p>
  <p v-for="n in 6" class="par-text">{{loremipsum}}</p>

  <p class="caption" v-scroll="scroll">Scroll Fire below</p>
  <p class="text-center">
    <img v-scroll-fire="scrollFire" src="../assets/mountains.jpg" style="width: 200px">
  </p>

  <p v-for="n in 3" class="par-text">{{loremipsum}}</p>
</template>

<script>
export default {
  data () {
    return {
      loremipsum: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    }
  },
  methods: {
    scroll (position) {
      console.log('v-scroll: position', position)
    },
    scrollFire (element) {
      element.velocity('callout.tada', {
        display: null,
        stagger: 200
      })
    }
  }
}
</script>
