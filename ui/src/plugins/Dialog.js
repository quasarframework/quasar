import DialogPlugin from '../components/dialog-plugin/DialogPlugin.js'
import globalDialog from '../utils/global-dialog.js'

export default {
  install ({ $q }) {
    this.create = $q.dialog = globalDialog(DialogPlugin)
  }
}
