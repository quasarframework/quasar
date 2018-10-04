<template>
  <div>
    <div class="q-layout-padding">
      <p class="caption">Scroll down to see it in action.</p>

      <q-toggle v-model="disable" label="Disable" class="q-mr-sm" />
      <q-toggle v-model="container" label="Container" />

      <div :class="container ? 'scroll' : ''" :style="styles">
        <q-infinite-scroll ref="inf" @load="load" :disable="disable">
          <div v-for="(item, index) in items" :key="index" class="caption">
            <q-chip square color="secondary" class="shadow-1">
              {{ index + 1 }}
            </q-chip>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </div>

          <div slot="message" class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" :size="40"/>
          </div>
        </q-infinite-scroll>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      items: [{}, {}, {}, {}, {}],
      disable: false,
      container: false
    }
  },
  computed: {
    styles () {
      return this.container ? 'height: 500px; border: 1px solid black;' : ''
    }
  },
  watch: {
    container () {
      this.$nextTick(() => {
        this.$refs.inf.updateScrollTarget()
      })
    }
  },
  methods: {
    load (index, done) {
      console.log('load called')
      setTimeout(() => {
        this.items.push({}, {}, {}, {}, {}, {}, {})
        done()
      }, 2500)
    }
  }
}
</script>
