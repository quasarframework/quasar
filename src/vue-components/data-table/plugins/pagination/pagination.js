import TablePagination from './TablePagination.vue'

const defaultOptions = [
  {label: 'All', value: 0},
  {label: '5', value: 5},
  {label: '10', value: 10},
  {label: '15', value: 15},
  {label: '20', value: 20},
  {label: '50', value: 50},
  {label: '100', value: 100}
]

function parseOptions (opts) {
  return [{label: 'All', value: 0}].concat(
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
    let
      cfg = this.config.pagination,
      rowsPerPage = 0, options = defaultOptions

    if (cfg) {
      if (cfg.rowsPerPage) {
        rowsPerPage = cfg.rowsPerPage
      }
      if (cfg.options) {
        options = parseOptions(cfg.options)
      }
    }

    return {
      pagination: {
        page: 1,
        entries: 0,
        options,
        rowsPerPage
      }
    }
  },
  watch: {
    'config.pagination': {
      deep: true,
      handler (cfg) {
        if (cfg === false) {
          this.pagination.rowsPerPage = 0
          return
        }
        if (typeof cfg.rowsPerPage !== 'undefined' && cfg.rowsPerPage !== this.pagination.rowsPerPage) {
          this.pagination.rowsPerPage = cfg.rowsPerPage
        }
        if (cfg.options) {
          this.pagination.options = parseOptions(cfg.options)
        }
      }
    },
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
