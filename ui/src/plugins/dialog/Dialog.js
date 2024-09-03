import DialogPlugin from './component/DialogPluginComponent.js'
import globalDialog from '../../utils/private.dialog/create-dialog.js'

export default {
  install ({ $q, parentApp }) {
    $q.dialog = this.create = globalDialog(DialogPlugin, true, parentApp)
  }
}
