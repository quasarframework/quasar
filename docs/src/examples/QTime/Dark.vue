<template>
  <div class="q-pa-md bg-grey-10 text-white">
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
