<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">
      <q-time
        v-model="time"
        :hour-options="hourOptions"
        :minute-options="minuteOptions"
        :second-options="secondOptions"
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
  }
}
</script>
