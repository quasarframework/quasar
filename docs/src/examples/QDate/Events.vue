<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">
      <q-date
        v-model="date"
        :events="events"
      />
    </div>
    <div class="row justify-center">
      <q-date
        v-model="date"
        :events="eventsFn"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      date: '2019/02/01',
      events: ['2019/02/01', '2019/02/05', '2019/02/06', '2019/02/09', '2019/02/23']
    }
  },
  methods: {
    eventsFn (date) {
      if (date === '2019/02/01' ||
        date === '2019/02/05' ||
        date === '2019/02/06' ||
        date === '2019/02/09' ||
        date === '2019/02/23') {
        return true
      }
      return false
    }
  }
}
</script>
