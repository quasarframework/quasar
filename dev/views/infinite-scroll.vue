<template>
  <div>
    <button class="primary" @click="loadMore()">Load More</button>
    <button class="primary" @click="reset()">Reset</button>
    <button class="primary" @click="stop()">Stop</button>
    <button class="primary" @click="resume()">Resume</button>
    <label>
      <quasar-toggle :model.sync="working"></quasar-toggle>
      Infinite Scroll working
    </label>

    <quasar-infinite-scroll :handler="refresher" :working.sync="working" inline style="height: 400px; overflow: auto; border: 1px solid black;" v-ref:infscroll>
      <p v-for="item in items" class="caption">
        <span class="label bg-secondary text-white shadow-1">
          {{ $index + 1 }}
        </span>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      </p>

      <spinner slot="message"></spinner>
    </quasar-infinite-scroll>

    <br><br>

    <quasar-infinite-scroll :handler="refresher" :working.sync="working" :offset="50">
      <p v-for="item in items" class="caption">
        <span class="label bg-secondary text-white shadow-1">
          {{ $index + 1 }}
        </span>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      </p>

      <spinner slot="message"></spinner>
    </quasar-infinite-scroll>
  </div>
</template>

<script>
export default {
  data () {
    return {
      items: [{}, {}, {}, {}, {}],
      working: true
    }
  },
  methods: {
    reset () {
      this.items = []
      this.$refs.infscroll.reset()
    },
    loadMore () {
      this.$refs.infscroll.loadMore()
    },
    stop () {
      this.$refs.infscroll.stop()
    },
    resume () {
      this.$refs.infscroll.resume()
    },
    refresher (index, done) {
      console.log('called scroll', index)

      setTimeout(() => {
        let items = []

        for (let i = 0; i < 7; i++) {
          items.push({})
        }

        this.items = this.items.concat(items)
        done()
      }, 1500)
    }
  }
}
</script>
