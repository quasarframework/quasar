<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-time
        v-model="time"
        :hour-options="hourOptions"
        :minute-options="minuteOptions"
        :second-options="secondOptions"
      />

      <q-time
        v-model="time"
        :options="optionsFn"
      />

      <q-time
        v-model="time"
        :options="optionsFn2"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      time: '10:56',

      hourOptions: [9, 10, 11, 13, 15],
      minuteOptions: [0, 15, 30, 45],
      secondOptions: [0, 10, 20, 30, 40, 50]
    }
  },

  methods: {
    optionsFn (hr, min, sec) {
      if (hr < 6 || hr > 15 || hr % 2 !== 0) {
        return false
      }
      if (min !== null && (min <= 25 || min >= 58)) {
        return false
      }
      if (sec !== null && sec % 10 !== 0) {
        return false
      }
      return true
    },

    optionsFn2 (hr) {
      return hr % 2 === 0
    }
  }
}
</script>
