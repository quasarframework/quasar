import DialogPlugin from '../components/dialog-plugin/DialogPlugin.js'
import globalDialog from '../utils/private/global-dialog.js'

export default {
  install ({ $q, parentApp }) {
    $q.dialog = globalDialog(DialogPlugin, true, parentApp)
    if (this.__installed !== true) {
      this.create = $q.dialog
    }
  }
}
