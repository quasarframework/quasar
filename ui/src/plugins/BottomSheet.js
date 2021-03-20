import BottomSheet from '../components/dialog-bottom-sheet/BottomSheet.js'
import globalDialog from '../utils/private/global-dialog.js'

export default {
  install ({ $q, parentApp }) {
    if (this.__installed === true) {
      $q.bottomSheet = globalDialog(BottomSheet, false, parentApp)
    }
    else {
      this.create = $q.bottomSheet = globalDialog(BottomSheet, false, parentApp)
    }
  }
}
