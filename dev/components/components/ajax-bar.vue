<template>
  <div>
    <q-ajax-bar ref="bar" :position="position" :reverse="reverse" :size="computedSize" :color="color"></q-ajax-bar>
    <div class="layout-padding" style="max-width: 600px;">
      <p class="caption">Ajax Bar component captures Ajax calls automatically. This page here triggers events manually for demonstrating purposes only.</p>

      <q-card style="margin-top: 25px">
        <q-card-title class="bg-primary text-center">
          <q-btn push color="orange" @click="trigger()">Trigger Event</q-btn>
        </q-card-title>

        <p class="caption text-center">Try out some combinations for Ajax Bar.</p>
        <q-card-main class="group column">
          <div class="auto column items-center">
            <div class="flex">
              <div class="column group">
                <q-radio v-model="position" val="top" label="Top" />
                <q-radio v-model="position" val="bottom" label="Bottom" />
              </div>

              <div class="column group">
                <q-radio v-model="position" val="right" label="Right" />
                <q-radio v-model="position" val="left" label="Left" />
              </div>
            </div>
          </div>

          <div class="row justify-center" style="margin-top: 15px;">
            <q-checkbox v-model="reverse" label="Reverse Direction" />
          </div>

          <q-field :label="`Size (<em>${size}px</em>)`">
            <q-range v-model="size" :min="2" :max="20" label-always />
          </q-field>

          <div class="auto column items-center">
            <div class="flex">
              <q-input float-label="Color" v-model="color" />
            </div>
          </div>
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
      color: '#e21b0c',

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
