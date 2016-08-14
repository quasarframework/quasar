<template>
  <div style="height: 400px; overflow: auto; border: 1px solid black;">
    <quasar-pull-to-refresh :handler="refresher">
      <p v-for="item in items" class="caption highlight-and-fade">
        <span class="label bg-secondary text-white shadow-1">
          {{ items.length - $index }}
        </span>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      </p>
    </quasar-pull-to-refresh>
  </div>

  <br><br>

  <quasar-pull-to-refresh :handler="refresher" style="border: 1px solid black;">
    <p v-for="item in items" class="caption highlight-and-fade">
      <span class="label bg-secondary text-white shadow-1">
        {{ items.length - $index }}
      </span>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    </p>
  </quasar-pull-to-refresh>
</template>

<script>
export default {
  data () {
    return {
      items: [{}, {}, {}, {}, {}, {}]
    }
  },
  methods: {
    refresher (done) {
      setTimeout(() => {
        done()
        this.items.unshift({})
      }, 3000)
    }
  }
}
</script>
