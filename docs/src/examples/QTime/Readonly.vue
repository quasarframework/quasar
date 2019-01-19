<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">
      <q-time
        v-model="time"
        readonly
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
