import { QActionSheet } from '../components/action-sheet'
import modalFn from '../utils/modal-fn'

export default {
  __installed: false,
  install ({ $q, Vue }) {
    if (this.__installed) { return }
    this.__installed = true

    $q.actionSheet = modalFn(QActionSheet, Vue)
  }
}
