import SelectFilter from './SelectFilter.vue'

export default {
  data () {
    return {
      filtering: {
        terms: ''
      }
    }
  },
  methods: {
    filter (options) {
      const terms = this.filtering.terms.toLowerCase()
      return options.filter(option => (option.label + '').toLowerCase().indexOf(terms) > -1)
    }
  },
  computed: {
    message () {
      if (this.optionValues.length) {
        return false
      }

      if (this.filtering.terms) {
        return 'No results. Please refine your search terms.'
      }

      return 'Nothing found.'
    }
  },
  components: {
    SelectFilter
  }
}
