import { sortDate } from '../../utils/sort'
import { isNumber, isDate } from '../../utils/is'

export default {
  props: {
    sortMethod: {
      type: Function,
      default (data, sortBy, descending) {
        const col = this.computedCols.find(def => def.name === sortBy)
        if (col === null || col.field === void 0) {
          return data
        }

        const
          dir = descending ? -1 : 1,
          val = typeof col.field === 'function'
            ? v => col.field(v)
            : v => v[col.field]

        return data.sort((a, b) => {
          let
            A = val(a),
            B = val(b)

          if (A === null || A === void 0) {
            return -1 * dir
          }
          if (B === null || B === void 0) {
            return 1 * dir
          }
          if (col.sort) {
            return col.sort(A, B) * dir
          }
          if (isNumber(A) && isNumber(B)) {
            return (A - B) * dir
          }
          if (isDate(A) && isDate(B)) {
            return sortDate(A, B) * dir
          }
          if (typeof A === 'boolean' && typeof B === 'boolean') {
            return (a - b) * dir
          }

          [A, B] = [A, B].map(s => (s + '').toLowerCase())

          return A < B
            ? -1 * dir
            : (A === B ? 0 : dir)
        })
      }
    }
  },
  computed: {
    columnToSort () {
      const { sortBy } = this.computedPagination

      if (sortBy) {
        const col = this.computedCols.find(def => def.name === sortBy)
        return col || null
      }
    }
  },
  methods: {
    sort (col /* String(col name) or Object(col definition) */) {
      if (col === Object(col)) {
        col = col.name
      }

      let { sortBy, descending } = this.computedPagination

      if (sortBy !== col) {
        sortBy = col
        descending = false
      }
      else if (descending) {
        sortBy = null
      }
      else {
        descending = true
      }

      this.setPagination({ sortBy, descending, page: 1 })
    }
  }
}
