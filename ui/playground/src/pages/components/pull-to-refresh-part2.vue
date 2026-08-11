<template>
  <div class="q-layout-padding">
    <q-pull-to-refresh
      color="white"
      bg-color="black"
      @refresh="refresher"
      :disable="disable"
    >
      <div
        v-for="(item, index) in items"
        :key="index"
        class="caption bg-yellow"
      >
        <q-chip square color="secondary">
          {{ items.length - index }}
        </q-chip>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur.
      </div>
    </q-pull-to-refresh>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'

const $q = useQuasar()

const items = ref([{}, {}, {}, {}, {}, {}, {}, {}, {}])
const disable = ref(false)

function refresher(done) {
  setTimeout(() => {
    items.value.push({})
    $q.notify('Item #' + items.value.length + ' is new.')
    done()
  }, 2000)
}
</script>
