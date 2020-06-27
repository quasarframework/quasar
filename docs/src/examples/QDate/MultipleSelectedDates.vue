<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-date
        :value="null"
        minimal
        default-year-month="2020/03"
        :ranges="selectedDates"
      />

      <q-date
        :value="null"
        minimal
        default-year-month="2020/04"
        :ranges="selectedDatesFn"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedDates: [ '2020/02/21', [ '2020/03/01', '2020/03/06' ], '2020/03/11', [ '2020/03/21', '2020/03/18' ], '2020/04/10' ]
    }
  },

  methods: {
    selectedDatesFn (date) {
      const day = date.slice(8, 10)

      if ([ '08', '14', '21' ].indexOf(day) > -1) {
        return true
      }

      if ([ '03', '04', '05' ].indexOf(day) > -1) {
        return {
          start: day === '03',
          end: day === '05',
          color: 'red'
        }
      }

      if (day >= '22' && day <= '28') {
        return {
          start: day === '22',
          end: day === '28',
          color: 'purple-12',
          outline: true
        }
      }
    }
  }
}
</script>
