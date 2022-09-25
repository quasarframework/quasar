import DialogPlugin from '../components/dialog-plugin/DialogPlugin.js'
import globalDialog from '../utils/private/global-dialog.js'

export default {
  install ({ $q }) {
    this.create = $q.dialog = globalDialog(DialogPlugin)
  }
}
