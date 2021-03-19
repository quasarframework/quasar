import DialogPlugin from '../components/dialog-plugin/DialogPlugin.js'
import globalDialog from '../utils/private/global-dialog.js'

export default {
  install (pluginOpts) {
    if (this.__installed === true) {
      pluginOpts.$q.dialog = this.create
    }
    else {
      this.create = pluginOpts.$q.dialog = globalDialog(DialogPlugin, true, pluginOpts)
    }
  }
}
