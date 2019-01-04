<template>
  <div>
    <div class="layout-padding">
      <p class="caption">Scroll down to see it in action.</p>
      <q-toggle v-model="active" label="Active" />

      <br>
      <q-infinite-scroll :handler="refresher" v-if="active">
        <div v-for="(item, index) in items" :key="index" class="caption">
          <q-chip square color="secondary" class="shadow-1">
            {{ index + 1 }}
          </q-chip>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </div>

        <div class="row justify-center" style="margin-bottom: 50px;">
          <q-spinner name="dots" slot="message" :size="40"/>
        </div>
      </q-infinite-scroll>
      <div v-else style="height: 300vh">Placeholder for scroll</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      items: [{}, {}, {}, {}, {}],
      active: true
    }
  },
  methods: {
    refresher (index, done) {
      setTimeout(() => {
        let items = []

        for (let i = 0; i < 7; i++) {
          items.push({})
        }

        this.items = this.items.concat(items)
        console.log('refresh')
        done()
      }, 2500)
    }
  }
}
</script>
