<template>
  <div class="q-pa-md">
    <div class="q-pb-sm">
      Model: {{ days }}
    </div>

    <q-date v-model="days" range multiple />
  </div>
</template>

<script>
export default {
  data () {
    return {
      days: [
        [ '2020/07/01', '2020/07/10' ],
        [ '2020/07/21', '2020/07/25' ]
      ]
    }
  }
}
</script>
