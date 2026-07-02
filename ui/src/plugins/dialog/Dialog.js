import DialogPlugin from './component/DialogPluginComponent.js'
import { createDialog } from '../../utils/private.dialog/create-dialog.js'

/**
 * @api plugin
 * @docsUrl https://v2.quasar.dev/quasar-plugins/dialog
 */
export default {
  install({ $q, parentApp }) {
    /**
     * Creates an ad-hoc Dialog; Same as calling $q.dialog(...)
     *
     * @api method create
     * @param {Object} opts Dialog options
     * @returns {Object} Chain Object
     */
    $q.dialog = this.create = createDialog(DialogPlugin, true, parentApp)
  }
}
