<template>
  <div>
    <div class="q-layout-padding">
      <p class="caption">
        Scroll down to see it in action.
      </p>

      <q-toggle v-model="active" label="Active" />
      <q-toggle v-model="disable" label="Disable" class="q-mr-sm" />
      <q-toggle v-model="reverse" label="Reverse" class="q-mr-sm" />
      <q-toggle v-model="container" label="Container" />

      <div ref="scrollTarget" :style="styles">
        <q-infinite-scroll @load="loadRef" :disable="disable" :reverse="reverse" v-if="active" :scroll-target="container ? $refs.scrollTarget : void 0">
          <div v-for="(item, index) in itemsRef" :key="index" class="caption">
            <q-chip square color="secondary" class="shadow-1">
              {{ index + 1 }}
            </q-chip>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </div>

          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner color="primary" name="dots" :size="40" />
            </div>
          </template>
        </q-infinite-scroll>
        <div v-else style="height: 300vh">
          Placeholder for scroll
        </div>
      </div>

      <div v-if="container" id="scroll-target" :style="styles">
        <q-infinite-scroll @load="loadId" :disable="disable" :reverse="reverse" v-if="active" scroll-target="#scroll-target">
          <div v-for="(item, index) in itemsId" :key="index" class="caption">
            <q-chip square color="secondary" class="shadow-1">
              {{ index + 1 }}
            </q-chip>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </div>

          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner color="primary" name="dots" :size="40" />
            </div>
          </template>
        </q-infinite-scroll>
        <div v-else style="height: 300vh">
          Placeholder for scroll
        </div>
      </div>

      <div v-if="container" id="reverse-target" :style="styles">
        <q-infinite-scroll @load="loadReverse" :disable="disable" :reverse="reverse === false" v-if="active" scroll-target="#reverse-target">
          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner color="primary" name="dots" size="40px" />
            </div>
          </template>

          <div v-for="(item, index) in itemsReverse" :key="itemsReverse.length - index" class="caption">
            <q-chip square color="secondary" class="shadow-1">
              {{ itemsReverse.length - index }}
            </q-chip>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </div>
        </q-infinite-scroll>
        <div v-else style="height: 300vh">
          Placeholder for scroll
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      itemsReverse: [{}, {}, {}, {}, {}],
      itemsRef: [{}, {}, {}, {}, {}],
      itemsId: [{}, {}, {}, {}, {}],
      disable: false,
      container: false,
      reverse: false,
      active: true
    }
  },
  computed: {
    styles () {
      return this.container ? 'height: 300px; border: 1px solid black; overflow: auto;' : ''
    }
  },
  methods: {
    loadReverse (index, done) {
      console.log('load reverse called')
      setTimeout(() => {
        this.itemsReverse.splice(0, 0, {}, {}, {}, {}, {}, {}, {})
        done()
      }, 2500)
    },

    loadRef (index, done) {
      console.log('load ref called')
      setTimeout(() => {
        this.itemsRef.push({}, {}, {}, {}, {}, {}, {})
        done()
      }, 2500)
    },

    loadId (index, done) {
      console.log('load id called')
      setTimeout(() => {
        this.itemsId.push({}, {}, {}, {}, {}, {}, {})
        done()
      }, 2500)
    }
  }
}
</script>
