import { QDialog } from '../components/dialog'
import modalFn from '../utils/modal-fn'
import { $q } from '../install'

export default {
  install ({ Vue }) {
    this.create = $q.dialog = modalFn(QDialog, Vue)
  }
}
