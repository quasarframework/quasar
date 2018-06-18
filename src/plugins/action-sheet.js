import { QActionSheet } from '../components/action-sheet'
import modalFn from '../utils/modal-fn'

export default {
  install ({ $q, Vue }) {
    this.create = $q.actionSheet = modalFn(QActionSheet, Vue)
  }
}
