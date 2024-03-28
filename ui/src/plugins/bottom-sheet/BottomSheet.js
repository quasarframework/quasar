import BottomSheet from './component/BottomSheetComponent.js'
import globalDialog from '../../utils/private/global-dialog.js'

export default {
  install ({ $q, parentApp }) {
    $q.bottomSheet = globalDialog(BottomSheet, false, parentApp)
    if (this.__installed !== true) {
      this.create = $q.bottomSheet
    }
  }
}
