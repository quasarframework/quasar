import Utils from '../../../../utils'
const labels = {
  columns: 'Columns',
  allCols: 'All Columns',
  rows: 'Rows'
}

export default {
  computed: {
    labels () {
      if (this.config && this.config.labels) {
        return Utils.extend({}, labels, this.config.labels)
      }
      return labels
    },
    message () {
      if (this.rows.length) {
        return false
      }

      if (this.filtering.terms) {
        return (this.config.messages && this.config.messages.noDataAfterFiltering) || '<i>warning</i> No results. Please refine your search terms.'
      }

      return (this.config.messages && this.config.messages.noData) || '<i>warning</i> No data available to show.'
    }
  }
}
