import { sortDate } from '../../utils/sort.js'
import { isNumber, isDate } from '../../utils/is.js'

export default {
  props: {
    sortMethod: {
      type: Function,
      default (data, sortBy, descending) {
        const col = this.columns.find(def => def.name === sortBy)
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
          if (col.sort !== void 0) {
            return col.sort(A, B) * dir
          }
          if (isNumber(A) === true && isNumber(B) === true) {
            return (A - B) * dir
          }
          if (isDate(A) === true && isDate(B) === true) {
            return sortDate(A, B) * dir
          }
          if (typeof A === 'boolean' && typeof B === 'boolean') {
            return (a - b) * dir
          }

          [A, B] = [A, B].map(s => (s + '').toLocaleString().toLowerCase())

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
        return this.columns.find(def => def.name === sortBy) || null
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
      else {
        if (this.binaryStateSort === true) {
          descending = !descending
        }
        else {
          if (descending === true) {
            sortBy = null
          }
          else {
            descending = true
          }
        }
      }

      this.setPagination({ sortBy, descending, page: 1 })
    }
  }
}
