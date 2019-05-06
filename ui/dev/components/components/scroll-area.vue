<template>
  <div class="q-layout-padding">
    <q-toggle v-model="horizontal" label="Horizontal" />

    <div style="height: 300px;" />
    <q-scroll-area ref="scroll" style="width: 400px; height: 500px;" class="bg-yellow" :horizontal="horizontal">
      <div :class="{ 'flex no-wrap' : horizontal }">
        <div style="margin-top: 150px" />
        <div style="margin-bottom: 25px" :style="horizontal ? 'width: 160px' : ''" v-for="n in number">
          {{ n }} Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. <q-btn>Click</q-btn>
        </div>
      </div>
    </q-scroll-area>

    <br>
    <q-btn @click="number--">
      Less
    </q-btn>
    <q-btn @click="number++">
      More
    </q-btn>
    <q-btn @click="scroll">
      Scroll to 125
    </q-btn>
    <q-btn @click="scroll2">
      Scroll to 525 (animated)
    </q-btn>

    <div style="height: 1000px" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      number: 10,
      horizontal: false
    }
  },
  methods: {
    scroll () {
      this.$refs.scroll.setScrollPosition(125)
    },
    scroll2 () {
      this.$refs.scroll.setScrollPosition(525, 1000)
    }
  }
}
</script>
