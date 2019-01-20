<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <q-time
        v-model="time"
        dark
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
  }
}
</script>
