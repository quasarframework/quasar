import BottomSheet from '../components/dialog-bottom-sheet/BottomSheet.js'
import globalDialog from '../utils/private/global-dialog.js'

export default {
  install ({ $q, parentApp }) {
    $q.bottomSheet = globalDialog(BottomSheet, false, parentApp)
    if (this.__installed !== true) {
      this.create = $q.bottomSheet
    }
  }
}
