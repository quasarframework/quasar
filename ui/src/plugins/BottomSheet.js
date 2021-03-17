import BottomSheet from '../components/dialog-bottom-sheet/BottomSheet.js'
import globalDialog from '../utils/private/global-dialog.js'

export default {
  install (pluginOpts) {
    this.create = pluginOpts.$q.bottomSheet = globalDialog(BottomSheet, false, pluginOpts)
  }
}
