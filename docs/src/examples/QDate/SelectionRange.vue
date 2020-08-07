<template>
  <div class="q-pa-md">
    <div class="q-pb-sm">
      Model: {{ days }}
    </div>

    <q-date v-model="days" range />
  </div>
</template>

<script>
export default {
  data () {
    return {
      days: [
        [ "2020/07/08", "2020/07/17" ]
      ]
    }
  }
}
</script>
