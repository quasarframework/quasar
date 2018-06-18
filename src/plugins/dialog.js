import { QDialog } from '../components/dialog'
import modalFn from '../utils/modal-fn'

export default {
  install ({ $q, Vue }) {
    this.create = $q.dialog = modalFn(QDialog, Vue)
  }
}
