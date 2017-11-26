import { QDialog } from '../components/dialog'
import modalFn from '../utils/modal-fn'

export default {
  __installed: false,
  install ({ $q, Vue }) {
    if (this.__installed) { return }
    this.__installed = true

    $q.dialog = modalFn(QDialog, Vue)
  }
}
