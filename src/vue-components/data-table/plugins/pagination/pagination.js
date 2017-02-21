import TablePagination from './TablePagination.vue'

const defaultOptions = [
  { label: 'All', value: 0 },
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '15', value: 15 },
  { label: '20', value: 20 },
  { label: '50', value: 50 },
  { label: '100', value: 100 }
]

function parseOptions (opts) {
  return [{ label: 'All', value: 0 }].concat(
    opts.map(opt => {
      return {
        label: '' + opt,
        value: Number(opt)
      }
    })
  )
}

export default {
  data () {
    return {
      _pagination: {
        page: 1,
        entries: 0,
        rowsPerPage: null
      }
    }
  },
  computed: {
    pagination () {
      let self = this,
        cfg = this.config.pagination,
        options = defaultOptions

      if (cfg) {
        if (cfg.options) {
          options = parseOptions(cfg.options)
        }
      }

      options[0].label = this.labels.all

      return {
        get page () { return self.$data._pagination.page },
        set page (page) { self.$data._pagination.page = page },
        get entries () { return self.$data._pagination.entries },
        set entries (entries) { self.$data._pagination.entries = entries },
        get rowsPerPage () {
          let rowsPerPage = self.$data._pagination.rowsPerPage
          if (rowsPerPage == null) {
            if (cfg && typeof cfg.rowsPerPage !== 'undefined') {
              rowsPerPage = cfg.rowsPerPage
            }
            else {
              rowsPerPage = 0
            }
          }
          return rowsPerPage
        },
        set rowsPerPage (rowsPerPage) { self.$data._pagination.rowsPerPage = rowsPerPage },
        options
      }
    }
  },
  watch: {
    'pagination.page' () {
      this.$refs.body.scrollTop = 0
    }
  },
  methods: {
    paginate (rows) {
      const
        page = this.pagination.page,
        number = this.pagination.rowsPerPage

      if (number <= 0) {
        return rows
      }
      return rows.slice((page - 1) * number, page * number)
    }
  },
  components: {
    TablePagination
  }
}
