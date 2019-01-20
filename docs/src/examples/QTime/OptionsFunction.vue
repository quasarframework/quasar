<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">
      <q-time
        v-model="time"
        :options="optionsFn"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      time: '10:56'
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
    }
  }

}
</script>
