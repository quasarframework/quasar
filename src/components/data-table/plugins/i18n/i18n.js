import extend from '../../../../utils/extend'
import { i18n } from '../../../../i18n/en'

export default {
  computed: {
    labels () {
      if (this.config && this.config.labels) {
        return extend({}, i18n.dataTable, this.config.labels)
      }
      return i18n.dataTable
    },
    message () {
      if (this.rows.length) {
        return false
      }

      if (this.filtering.terms) {
        return (this.config.messages && this.config.messages.noDataAfterFiltering) || i18n.dataTable.noDataAfterFiltering
      }

      return (this.config.messages && this.config.messages.noData) || i18n.dataTable.noData
    }
  }
}
