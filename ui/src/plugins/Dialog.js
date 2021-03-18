import DialogPlugin from '../components/dialog-plugin/DialogPlugin.js'
import globalDialog from '../utils/private/global-dialog.js'

export default {
  install (pluginOpts) {
    this.create = pluginOpts.$q.dialog = globalDialog(DialogPlugin, true, pluginOpts)
  }
}
