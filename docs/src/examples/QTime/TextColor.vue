<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">
      <q-time
        v-model="time"
        color="secondary"
        text-color="orange-11"
      />
    </div>
    <div class="row justify-center">
      <q-time
        v-model="time"
        color="orange-7"
        text-color="blue-grey-9"
      />
    </div>
    <div class="row justify-center">
      <q-time
        v-model="time"
        color="blue-grey-7"
        text-color="yellow-12"
      />
    </div>
    <div class="row justify-center">
      <q-time
        v-model="time"
        color="purple-3"
        text-color="blue-10"
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
