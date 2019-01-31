<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-time v-model="time" />

      <q-time
        v-model="timeWithSeconds"
        with-seconds
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      time: '10:56',
      timeWithSeconds: '09:24:10'
    }
  }
}
</script>
