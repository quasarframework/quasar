import { QActionSheet } from '../components/action-sheet'
import modalFn from '../utils/modal-fn'
import { $q } from '../install'

export default {
  install ({ Vue }) {
    this.create = $q.actionSheet = modalFn(QActionSheet, Vue)
  }
}
