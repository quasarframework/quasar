import DialogPlugin from '../components/dialog/DialogPlugin.js'
import modalFn from '../utils/modal-fn.js'

export default {
  install ({ $q }) {
    this.create = $q.dialog = modalFn(DialogPlugin)
  }
}
