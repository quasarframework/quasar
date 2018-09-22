<template>
  <div>
    <div class="layout-padding">
      <div>Value</div>
      <q-slider v-model="value" :min="range.min" :max="range.max" label />
      <div>Size</div>
      <q-slider v-model="size" :min="1" :max="500" label />
      <div>Thickness</div>
      <q-slider v-model="thickness" :min="1" :max="maxThickness" label />
      <div>Angle</div>
      <q-slider v-model="angle" :min="0" :max="360" label />
      <div>Min/Max</div>
      <q-range v-model="range" :min="0" :max="360" label />
      <div>
        <q-toggle v-model="reverse" label="Reverse" />
        <q-toggle v-model="showValue" label="Show Value" />
      </div>
      <div>
        <q-btn @click="value = 10" label="Set value to 10" flat color="primary" class="q-mr-sm" />
        <q-btn @click="value = 70" label="Set value to 70" flat color="secondary" />
      </div>

      <div class="q-mb-xl" />

      <q-circular-progress
        class="q-ma-sm"
        :value="value"
        :show-value="showValue"
      />

      <q-circular-progress
        class="q-ma-sm text-grey"
        :value="value"
        :size="size"
        :thickness="thickness"
        :angle="angle"
        :min="range.min"
        :max="range.max"
        :reverse="reverse"
        :show-value="showValue"
        color="orange"
        center-color="grey-8"
        track-color="transparent"
      />

      <q-circular-progress
        class="q-ma-sm text-white"
        style="font-size: 42px"
        :value="value"
        :size="size"
        :thickness="maxThickness"
        :angle="angle"
        :min="range.min"
        :max="range.max"
        :reverse="reverse"
        :show-value="showValue"
        color="grey-8"
        text-color="white"
        track-color="orange"
      />

      <q-circular-progress
        class="q-ma-sm"
        :value="value"
        :size="size"
        :thickness="thickness"
        :angle="angle"
        :min="range.min"
        :max="range.max"
        :reverse="reverse"
        :show-value="showValue"
        color="orange"
      />

      <q-circular-progress
        class="q-ma-sm text-orange"
        style="font-size: 56px"
        :value="value"
        :size="size"
        :thickness="thickness"
        :angle="angle"
        :min="range.min"
        :max="range.max"
        :reverse="reverse"
        :font-size="32"
        :show-value="showValue"
        color="orange"
        text-color="white"
        center-color="grey-8"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: 70,
      size: 160,
      thickness: 20,
      angle: 0,
      range: {
        min: 0,
        max: 100
      },
      showValue: true,
      reverse: false
    }
  },
  computed: {
    maxThickness () {
      return Math.round(this.size / 2)
    }
  },
  methods: {
    randomize () {
      this.progress = Math.round(Math.random() * 100)
    },
    randomizeBuffer () {
      this.progressBuffer = Math.round(Math.random() * 51)
      this.buffer = Math.round(Math.random() * 47)
    }
  }
}
</script>
