<template>
  <div>
    <q-ajax-bar ref="bar" :position="position" :reverse="reverse" :size="computedSize" :color="color"></q-ajax-bar>
    <div class="layout-padding" style="max-width: 600px;">
      <p class="caption">Ajax Bar component captures Ajax calls automatically. This page here triggers events manually for demonstrating purposes only.</p>

      <div class="card" style="margin-top: 25px">
        <div class="card-title bg-primary text-center">
          <button class="orange push" @click="trigger()">Trigger Event</button>
        </div>

        <p class="caption text-center">Try out some combinations for Ajax Bar.</p>
        <div class="card-content group column">
          <div class="auto column items-center">
            <div class="flex">
              <div class="column group">
                <label>
                  <q-radio v-model="position" val="top"></q-radio>
                  Top
                </label>
                <label>
                  <q-radio v-model="position" val="bottom"></q-radio>
                  Bottom
                </label>
              </div>

              <div class="column group">
                <label>
                  <q-radio v-model="position" val="right"></q-radio>
                  Right
                </label>
                <label>
                  <q-radio v-model="position" val="left"></q-radio>
                  Left
                </label>
              </div>
            </div>
          </div>

          <div class="row justify-center" style="margin-top: 15px;">
            <label style="white-space: nowrap;">
              <q-checkbox v-model="reverse"></q-checkbox>
              Reverse Direction
            </label>
          </div>

          <div>
            <span>Size (<em>{{size}}px</em>)</span>
            <q-range v-model="size" :min="2" :max="20" label-always style="margin-top: 25px;"></q-range>
          </div>

          <div class="auto column items-center">
            <div class="flex">
              <div class="floating-label">
                <input required v-model="color">
                <label>Color</label>
              </div>
            </div>
          </div>
        </div>
      </div>
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
