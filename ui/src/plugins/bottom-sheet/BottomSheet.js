import BottomSheet from './component/BottomSheetComponent.js'
import globalDialog from '../../utils/private.dialog/create-dialog.js'

export default {
  install ({ $q, parentApp }) {
    $q.bottomSheet = this.create = globalDialog(BottomSheet, false, parentApp)
  }
}
