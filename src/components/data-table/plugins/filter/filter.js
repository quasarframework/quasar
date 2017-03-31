import TableFilter from './TableFilter.vue'

export default {
  data () {
    return {
      filtering: {
        field: '',
        terms: ''
      }
    }
  },
  watch: {
    'filtering.terms' () {
      this.resetBody()
    }
  },
  computed: {
    filteringCols () {
      return this.cols.filter(col => col.filter)
    }
  },
  methods: {
    filter (rows) {
      const
        field = this.filtering.field,
        terms = this.filtering.terms.toLowerCase()

      if (field) {
        return rows.filter(row => (row[field] + '').toLowerCase().indexOf(terms) > -1)
      }

      return rows.filter(row => {
        return this.filteringCols.some(col => (row[col.field] + '').toLowerCase().indexOf(terms) > -1)
      })
    }
  },
  components: {
    TableFilter
  }
}
