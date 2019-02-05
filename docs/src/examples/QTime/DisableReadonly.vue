<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-time
        v-model="time"
        disable
      />

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
