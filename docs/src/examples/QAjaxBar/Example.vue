<template>
  <div>
    <div class="q-layout-padding" style="max-width: 100%;">
      <p class="caption">The Ajax Bar component captures Ajax calls automatically. This example triggers events manually for demonstrating purposes only.</p>

      <q-card style="margin-top: 25px">
        <q-card-section class="bg-primary text-center">
          <q-btn push color="orange" @click="trigger()">Trigger Event</q-btn>
        </q-card-section>

        <p class="caption text-center">Try out different combinations to change the Ajax Bar effect.</p>
        <q-card-section>
          <div class="text-h6">Position</div>
          <div class="flex">
            <div class="column">
              <q-radio v-model="position" val="top" label="Top" />
              <q-radio v-model="position" val="bottom" label="Bottom" />
            </div>

            <div class="column">
              <q-radio v-model="position" val="right" label="Right" />
              <q-radio v-model="position" val="left" label="Left" />
            </div>
          </div>

          <div class="text-h6 q-mt-md">Reverse?</div>
          <q-checkbox v-model="reverse" label="Reverse Direction" />

          <div class="text-h6 q-mt-md">Select a Color?</div>
          <div class="q-gutter-sm q-pl-sm">
            <q-btn
              v-for="color in mainColors"
              :key="color"
              :color="color"
              text-color="white"
              size="0.65rem"
              @click="selectColor(color)"
              :label="color"
            />
          </div>
          <div class="text-h6 q-pl-sm">
           <q-avatar size="21px" rounded :color="selectedColor" /> {{ selectedColor }} selected!
          </div>

          <div class="text-h6 q-mt-md">Size</div>
          <q-slider v-model="size" :min="2" :max="20" label-always :label-value="`${size}px`" />
        </q-card-section>
      </q-card>
    </div>
    <q-ajax-bar ref="bar" :color="selectedColor" :position="position" :reverse="reverse" :size="computedSize" />
  </div>
</template>

<script>
const mainColors = ['primary', 'secondary', 'tertiary', 'positive', 'negative', 'info', 'warning', 'black']

export default {
  data () {
    return {
      position: 'top',
      reverse: false,
      size: 5,

      mainColors,

      timeouts: [],
      selectedColor: 'negative'
    }
  },
  computed: {
    computedSize () {
      return this.size + 'px'
    }
  },
  methods: {
    trigger () {
      console.log('color is: ', this.inputModelHex)
      this.$refs.bar.start()

      setTimeout(() => {
        if (this.$refs.bar) {
          this.$refs.bar.stop()
        }
      }, Math.random() * 3000 + 1000)
    },
    selectColor (color) {
      this.selectedColor = color
    }
  }
}
</script>
