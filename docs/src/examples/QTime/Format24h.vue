<template>
  <div class="q-pa-md">
    <q-time
      v-model="time"
      format24h
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      time: '19:42'
    }
  }
}
</script>
