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
export default {
  data () {
    return {
      counter: 0
    }
  },

  methods: {
    startCounting () {
      this.timer = setInterval(() => {
        this.counter++
      }, 1000)
    },

    stopCounting () {
      clearInterval(this.timer)
    }
  },

  beforeDestroy () {
    this.stopCounting()
  }
}
</script>
