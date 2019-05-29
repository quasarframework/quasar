<template>
  <div class="q-layout-padding">
    <div class="text-h6 q-mb-md">
      Mask "x": {{ timestamp }}
    </div>
    <div class="row items-start q-gutter-sm">
      <q-date
        v-model="timestamp"
        today-btn
        mask="x"
      />

      <q-time
        v-model="timestamp"
        now-btn
        mask="x"
      />
    </div>

    <div class="text-h6 q-my-md">
      Mask "YYYY-MM-DD HH:mm:ss": {{ date }}
    </div>
    <div class="row items-start q-gutter-sm">
      <q-date
        v-model="date"
        today-btn
        mask="YYYY-MM-DD HH:mm:ss"
      />

      <q-time
        v-model="date"
        now-btn
        mask="YYYY-MM-DD HH:mm:ss"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      timestamp: '1558626538737',
      date: '2019-05-23 19:57:02'
    }
  }
}
</script>
