<template>
  <div class="q-pa-md" style="max-width: 350px">
    <q-expansion-item
      class="shadow-1 overflow-hidden"
      style="border-radius: 30px"
      icon="explore"
      label="Counter"
      @show="startCounting"
      @hide="stopCounting"
      header-class="bg-primary text-white"
      expand-icon-class="text-white"
    >
      <q-card>
        <q-card-section>
          Counting: <q-badge color="secondary">{{ counter }}</q-badge>.
          Will only count when opened, using the show/hide events to control count timer.
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </div>
</template>

<script>
import { ref, onBeforeUnmount } from 'vue'

export default {
  setup () {
    const counter = ref(0)
    let timer

    function stopCounting () {
      clearInterval(timer)
    }

    onBeforeUnmount(stopCounting)

    return {
      counter,

      startCounting () {
        timer = setInterval(() => {
          counter.value++
        }, 1000)
      },

      stopCounting
    }
  }
}
</script>
