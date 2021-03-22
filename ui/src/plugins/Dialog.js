import DialogPlugin from '../components/dialog-plugin/DialogPlugin.js'
import globalDialog from '../utils/private/global-dialog.js'

export default {
  install ({ $q, parentApp }) {
    if (this.__installed === true) {
      $q.dialog = globalDialog(DialogPlugin, true, parentApp)
    }
    else {
      this.create = $q.dialog = globalDialog(DialogPlugin, true, parentApp)
    }
  }
}
