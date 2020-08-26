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
        { from: '2020/07/01', to: '2020/07/10' },
        { from: '2020/07/21', to: '2020/07/25' }
      ]
    }
  }
}
</script>
