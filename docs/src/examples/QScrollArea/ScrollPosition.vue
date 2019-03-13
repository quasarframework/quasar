<template>
  <div class="q-pa-md">
    <div class="row q-gutter-md q-mb-md">
      <q-btn :label="`Scroll to ${position}px`" color="primary" @click="scroll" />
      <q-btn :label="`Animate to ${position}px`" color="primary" @click="animateScroll" />
    </div>

    <q-scroll-area ref="scrollArea" style="height: 150px; max-width: 300px;">
      <ol>
        <li v-for="n in 1000" :key="n">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        </li>
      </ol>
    </q-scroll-area>
  </div>
</template>

<script>
export default {
  data: () => ({
    position: 300
  }),
  methods: {
    scroll () {
      this.$refs.scrollArea.setScrollPosition(this.position)
      this.position = Math.floor(Math.random() * 1001) * 20
    },

    animateScroll () {
      this.$refs.scrollArea.setScrollPosition(this.position, 300)
      this.position = Math.floor(Math.random() * 1001) * 20
    }
  }
}
</script>
