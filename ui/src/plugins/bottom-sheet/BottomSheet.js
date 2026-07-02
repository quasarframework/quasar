import BottomSheet from './component/BottomSheetComponent.js'
import { createDialog } from '../../utils/private.dialog/create-dialog.js'

/**
 * @api plugin
 * @docsUrl https://v2.quasar.dev/quasar-plugins/bottom-sheet
 */
export default {
  install({ $q, parentApp }) {
    /**
     * Creates an ad-hoc Bottom Sheet; Same as calling $q.bottomSheet(...)
     *
     * @api method create
     * @param {Object} opts Bottom Sheet options
     */
    $q.bottomSheet = this.create = createDialog(BottomSheet, false, parentApp)
  }
}
