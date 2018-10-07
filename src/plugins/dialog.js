import QDialog from '../components/dialog/QDialog.js'
import modalFn from '../utils/modal-fn.js'

export default {
  install ({ $q }) {
    this.create = $q.dialog = modalFn(QDialog)
  }
}
