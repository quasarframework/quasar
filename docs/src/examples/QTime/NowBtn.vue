<template>
  <div class="q-pa-md">
    <q-time
      v-model="time"
      now-btn
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      time: '04:56'
    }
  }
}
</script>
