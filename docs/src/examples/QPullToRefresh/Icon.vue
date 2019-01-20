<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">
      <div style="height: 250px; width: 80%; border: 1px solid lightgray;" class="scroll">
        <q-pull-to-refresh
          @refresh="refresh"
          color="yellow-9"
          icon="lightbulb"
        >
          <div v-for="(item, index) in items" :key="index" class="caption">
            <q-chip square color="secondary" class="shadow-1">
              {{ items.length - index }}
            </q-chip>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </div>
        </q-pull-to-refresh>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      items: [{}, {}, {}, {}, {}, {}, {}]
    }
  },

  methods: {
    refresh (done) {
      setTimeout(() => {
        this.items.push({}, {}, {}, {}, {}, {}, {})
        done()
      }, 1000)
    }
  }
}
</script>
