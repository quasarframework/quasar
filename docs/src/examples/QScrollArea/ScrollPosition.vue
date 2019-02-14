<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-12">
        <q-btn :label="`Scroll to ${position}px`" color="primary" @click="scrollToRandom"/>
      </div>
    </div>
    <div class="row q-ma-md">
      <div class="col-12">
        <q-scroll-area ref="scrollArea" style="height: 150px; max-width: 300px;">
          <ol>
            <li v-for="n in 1000" :key="n">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</li>
          </ol>
        </q-scroll-area>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    position: 300
  }),
  methods: {
    scrollToRandom () {
      this.position = Math.floor(Math.random() * 1001) * 20
      this.$refs.scrollArea.setScrollPosition(this.position)
    }
  }
}
</script>
