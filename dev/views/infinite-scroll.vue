<template>
  <quasar-infinite-scroll :handler="refresher" inline style="height: 400px; overflow: auto; border: 1px solid black;">
    <p v-for="item in items" class="caption">
      <span class="label bg-secondary text-white shadow-1">
        {{ $index + 1 }}
      </span>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    </p>

    <spinner slot="message"></spinner>
  </quasar-infinite-scroll>

  <br><br>

  <quasar-infinite-scroll :handler="refresher">
    <p v-for="item in items" class="caption">
      <span class="label bg-secondary text-white shadow-1">
        {{ $index + 1 }}
      </span>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    </p>

    <spinner slot="message"></spinner>
  </quasar-infinite-scroll>
</template>

<script>
export default {
  data () {
    return {
      items: [{}, {}, {}, {}, {}]
    }
  },
  methods: {
    refresher (index, done) {
      console.log('called scroll', index)

      setTimeout(() => {
        var items = []

        for (var i = 0; i < 7; i++) {
          items.push({})
        }

        this.items = this.items.concat(items)
        done()
      }, 1500)
    }
  }
}
</script>
