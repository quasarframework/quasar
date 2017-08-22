import extend from '../../../../utils/extend'

export default {
  computed: {
    labels () {
      return this.config && this.config.labels
        ? extend({}, this.$q.i18n.dataTable, this.config.labels)
        : this.$q.i18n.dataTable
    },
    message () {
      if (this.rows.length) {
        return false
      }

      if (this.filtering.terms) {
        return (this.config.messages && this.config.messages.noDataAfterFiltering) || this.$q.i18n.dataTable.noDataAfterFiltering
      }

      return (this.config.messages && this.config.messages.noData) || this.$q.i18n.dataTable.noData
    }
  }
}
