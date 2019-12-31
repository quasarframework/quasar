<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-date
        v-model="date"
        :options="options"
      />

      <q-date
        v-model="date"
        :options="optionsFn"
      />

      <q-date
        v-model="date"
        :options="optionsFn2"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      date: '2019/02/01',
      options: [ '2019/02/01', '2019/02/05', '2019/02/06', '2019/02/09', '2019/02/23' ]
    }
  },

  methods: {
    optionsFn (date) {
      return date >= '2019/02/03' && date <= '2019/02/15'
    },

    optionsFn2 (date) {
      const parts = date.split('/')
      return parts[2] % 2 === 0
    }
  }
}
</script>
