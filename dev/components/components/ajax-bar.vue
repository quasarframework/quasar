<template>
  <div>
    <q-ajax-bar ref="bar" :position="position" :reverse="reverse" :size="computedSize" />
    <div class="layout-padding" style="max-width: 600px;">
      <p class="caption">Ajax Bar component captures Ajax calls automatically. This page here triggers events manually for demonstrating purposes only.</p>

      <q-card style="margin-top: 25px">
        <q-card-title class="bg-primary text-center">
          <q-btn push color="orange" @click="trigger()">Trigger Event</q-btn>
        </q-card-title>

        <p class="caption text-center">Try out some combinations for Ajax Bar.</p>
        <q-card-main>
          <q-field
            label="Position"
          >
            <div class="flex" style="margin: -5px">
              <div class="column group">
                <q-radio v-model="position" val="top" label="Top" />
                <q-radio v-model="position" val="bottom" label="Bottom" />
              </div>

              <div class="column group">
                <q-radio v-model="position" val="right" label="Right" />
                <q-radio v-model="position" val="left" label="Left" />
              </div>
            </div>
          </q-field>

          <q-field
            label="Reverse?"
          >
            <q-checkbox v-model="reverse" label="Reverse Direction" />
          </q-field>

          <q-field label="Size">
            <q-slider v-model="size" :min="2" :max="20" label-always :label-value="`${size}px`" />
          </q-field>
        </q-card-main>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      position: 'bottom',
      reverse: false,
      size: 8,

      timeouts: []
    }
  },
  computed: {
    computedSize () {
      return this.size + 'px'
    }
  },
  methods: {
    trigger () {
      this.$refs.bar.start()

      setTimeout(() => {
        if (this.$refs.bar) {
          this.$refs.bar.stop()
        }
      }, Math.random() * 5000 + 2000)
    }
  }
}
</script>
