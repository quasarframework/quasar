<template>
  <div class="q-pa-md scroll" style="height: 300px">
    <q-pull-to-refresh
      @refresh="refresh"
      color="orange-2"
      bg-color="black"
      icon="autorenew"
    >
      <div v-for="(item, index) in items" :key="index" class="q-mb-sm">
        <q-badge color="accent">
          {{ items.length - index }}
        </q-badge>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      </div>
    </q-pull-to-refresh>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const items = ref([ {}, {}, {}, {}, {}, {}, {}, {}, {} ])

    return {
      items,

      refresh (done) {
        setTimeout(() => {
          items.value.push({}, {}, {}, {}, {}, {}, {})
          done()
        }, 1000)
      }
    }
  }
}
</script>
