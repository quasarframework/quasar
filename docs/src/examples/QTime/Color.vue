<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">
      <q-time
        v-model="time"
        color="secondary"
      />
    </div>
    <div class="row justify-center">
      <q-time
        v-model="time"
        color="orange-7"
      />
    </div>
    <div class="row justify-center">
      <q-time
        v-model="time"
        color="blue-grey-7"
      />
    </div>
    <div class="row justify-center">
      <q-time
        v-model="time"
        color="purple-3"
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
