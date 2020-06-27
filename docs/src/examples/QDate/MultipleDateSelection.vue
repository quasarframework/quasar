<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-date
        :value="null"
        default-year-month="2020/03"
        :ranges="selectedDates"
        minimal
        color="pink"
        @input="onSelection"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedDates: [ '2020/02/21', '2020/03/11', '2020/03/21', '2020/03/18', '2020/04/10' ]
    }
  },

  methods: {
    onSelection (date) {
      const index = this.selectedDates.indexOf(date)

      if (index > -1) {
        // remove selection
        this.selectedDates.splice(index, 1)
      }
      else {
        // add selection
        this.selectedDates.push(date)
      }
    }
  }
}
</script>
