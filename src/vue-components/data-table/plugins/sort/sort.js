function nextDirection (dir) {
  if (dir === 0) {
    return 1
  }
  if (dir === 1) {
    return -1
  }
  return 0
}

export default {
  data () {
    return {
      sorting: {
        field: '',
        dir: 0
      }
    }
  },
  watch: {
    'sorting.dir' () {
      this.resetBody()
    }
  },
  methods: {
    setSortField (field) {
      if (this.sorting.field === field) {
        this.sorting.dir = nextDirection(this.sorting.dir)
        if (this.sorting.dir === 0) {
          this.sorting.field = ''
        }
        return
      }

      this.sorting.field = field
      this.sorting.dir = 1
    },
    sort (rows) {
      if (typeof rows[0][this.sorting.field] === 'string') {
        rows.sort((a, b) => {
          let
            f1 = a[this.sorting.field],
            f2 = b[this.sorting.field]

          return (this.sorting.dir === 1 ? 1 : -1) * f1.localeCompare(f2)
        })
        return
      }
      rows.sort((a, b) => {
        let
          f1 = a[this.sorting.field],
          f2 = b[this.sorting.field]

        if (f1 < f2) { return this.sorting.dir === 1 ? -1 : 1 }
        if (f1 === f2) { return 0 }
        return this.sorting.dir === 1 ? 1 : -1
      })
    }
  }
}
