import { QSelect } from '../select'

export default {
  name: 'q-data-table-columns',
  props: {
    value: {
      type: Array,
      required: true
    },
    label: {
      type: String,
      default: 'Columns'
    },
    columns: {
      type: Array,
      required: true
    },
    color: String
  },
  computed: {
    computedOptions () {
      return this.columns.filter(col => !col.required).map(col => ({
        value: col.name,
        label: col.label
      }))
    }
  },
  render (h) {
    return h(QSelect, {
      props: {
        multiple: true,
        toggle: true,
        value: this.value,
        options: this.computedOptions,
        displayValue: this.label,
        color: this.color
      }
    })
  }
}
