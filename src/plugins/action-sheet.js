import QActionSheet from '../components/action-sheet/QActionSheet.js'
import modalFn from '../utils/modal-fn.js'

export default {
  install ({ $q, Vue }) {
    this.create = $q.actionSheet = modalFn(QActionSheet, Vue)
  }
}
