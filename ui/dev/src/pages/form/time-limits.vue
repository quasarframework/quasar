<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <div>
        <div>{{ time1 }}</div>
        <q-time
          v-model="time1"
          :hour-options="hourOptionsTime1"
          :minute-options="minuteOptionsTime1"
          :second-options="secondOptionsTime1"
          with-seconds
          format24h
        />
      </div>

      <div>
        <div>{{ time2 }}</div>
        <q-time
          v-model="time2"
          :options="optionsTime2"
          with-seconds
        />
      </div>

      <div>
        <div>{{ time3 }}</div>
        <q-time
          v-model="time3"
          :options="optionsTime3"
          format24h
        />
      </div>

      <div>
        <div>{{ time4 || 'null' }}</div>
        <q-time
          v-model="time4"
          :options="optionsTime4"
          format24h
        />
      </div>

      <div>
        <div>{{ time5 || 'null' }}</div>
        <q-time
          v-model="time5"
          :options="optionsTime5"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      time1: '10:45:40',
      time2: '14:27:20',
      time3: '09:56',
      time4: null, // '09:56',
      time5: null, // '09:56',

      hourOptionsTime1: [ 9, 10, 11, 13, 15 ],
      minuteOptionsTime1: [ 0, 15, 30, 45 ],
      secondOptionsTime1: [ 0, 10, 20, 30, 40, 50 ]
    }
  },

  methods: {
    optionsTime2 (hr, min, sec) {
      if (hr < 6 || hr > 15 || hr % 2 !== 0) {
        return false
      }
      if (min !== null && (min <= 25 || min >= 58)) {
        return false
      }
      if (sec !== null && sec % 25 !== 0) {
        return false
      }
      return true
    },

    optionsTime3 (hr) {
      return hr >= 12
        ? hr === 13 || (hr !== 12 && hr % 3 !== 0)
        : hr === 1 || (hr !== 0 && hr % 3 === 0)
    },

    optionsTime4 (hr) {
      return hr < 12 && (
        hr === 1 || (hr !== 0 && hr % 3 === 0)
      )

      // return hr >= 12 && (
      //   hr === 13 || (hr !== 12 && hr % 3 === 0)
      // )
    },

    optionsTime5 (hr) {
      // return hr < 12 && (
      //   hr === 1 || (hr !== 0 && hr % 3 === 0)
      // )

      return hr >= 12 && (
        hr === 13 || (hr !== 12 && hr % 3 === 0)
      )
    }
  }
}
</script>
