export default {
  computed: {
    labels () {
      const labels = this.config && this.config.labels ? this.config.labels : {}
      return {
        columns: labels.columns || 'Columns',
        allFields: labels.allFields || 'All Fields',
        rows: labels.rows || 'Rows'
      }
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
