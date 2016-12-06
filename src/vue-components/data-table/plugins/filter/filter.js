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
    },
    'config.filter' (value) {
      if (this.toolbar === 'filter' && !value) {
        this.toolbar = ''
        this.filtering.terms = ''
      }
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
        return Object.keys(row).some(key => (row[key] + '').toLowerCase().indexOf(terms) > -1)
      })
    }
  },
  components: {
    TableFilter
  }
}
