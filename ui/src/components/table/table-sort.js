import { sortDate } from '../../utils/sort.js'
import { isNumber, isDate } from '../../utils/is.js'

export default {
  props: {
    sortMethod: {
      type: Function,
      default (data, sortBy, descending) {
        const col = this.colList.find(def => def.name === sortBy)
        if (col === void 0 || col.field === void 0) {
          return data
        }

        const
          dir = descending === true ? -1 : 1,
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
            return col.sort(A, B, a, b) * dir
          }
          if (isNumber(A) === true && isNumber(B) === true) {
            return (A - B) * dir
          }
          if (isDate(A) === true && isDate(B) === true) {
            return sortDate(A, B) * dir
          }
          if (typeof A === 'boolean' && typeof B === 'boolean') {
            return (A - B) * dir
          }

          [A, B] = [A, B].map(s => (s + '').toLocaleString().toLowerCase())

          return A < B
            ? -1 * dir
            : (A === B ? 0 : dir)
        })
      }
    },

    columnSortOrder: {
      type: String,
      validator: v => v === 'ad' || v === 'da',
      default: 'ad'
    }
  },

  computed: {
    columnToSort () {
      const { sortBy } = this.computedPagination

      if (sortBy) {
        return this.colList.find(def => def.name === sortBy) || null
      }
    }
  },

  methods: {
    sort (col /* String(col name) or Object(col definition) */) {
      let sortOrder = this.columnSortOrder

      if (col === Object(col)) {
        if (col.sortOrder) {
          sortOrder = col.sortOrder
        }

        col = col.name
      }
      else {
        const def = this.colList.find(def => def.name === col)
        if (def !== void 0 && def.sortOrder) {
          sortOrder = def.sortOrder
        }
      }

      let { sortBy, descending } = this.computedPagination

      if (sortBy !== col) {
        sortBy = col
        descending = sortOrder === 'da'
      }
      else if (this.binaryStateSort === true) {
        descending = !descending
      }
      else if (descending === true) {
        if (sortOrder === 'ad') {
          sortBy = null
        }
        else {
          descending = false
        }
      }
      else { // ascending
        if (sortOrder === 'ad') {
          descending = true
        }
        else {
          sortBy = null
        }
      }

      this.setPagination({ sortBy, descending, page: 1 })
    }
  }
}
