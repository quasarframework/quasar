import QDialog from '../components/dialog/QDialog.js'
import modalFn from '../utils/modal-fn.js'

export default {
  install ({ $q, Vue }) {
    this.create = $q.dialog = modalFn(QDialog, Vue)
  }
}
