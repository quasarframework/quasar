<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-date
        :value="null"
        minimal
        default-year-month="2020/03"
        :ranges="selectedWeek"
        @input="selectWeek"
      />
    </div>
  </div>
</template>

<script>
import { date } from 'quasar'

const {
  getDayOfWeek,
  addToDate,
  formatDate
} = date

export default {
  data () {
    return {
      selectedWeek: [ [ '2020/03/08', '2020/03/14' ] ]
    }
  },

  methods: {
    selectWeek (date) {
      const dayOfWeek = getDayOfWeek(date)
      const days = dayOfWeek === 7 ? 0 : -dayOfWeek
      const start = addToDate(date, { days })
      const end = addToDate(date, { days: 6 + days })
      console.log(date, start, end, days)

      this.selectedWeek = [ [ formatDate(start, 'YYYY/MM/DD'), formatDate(end, 'YYYY/MM/DD') ] ]
    }
  }
}
</script>
