import { QActionSheet } from '../components/action-sheet'
import modalFn from '../utils/modal-fn'

export default {
  __installed: false,
  install ({ Quasar, Vue }) {
    if (this.__installed) { return }
    this.__installed = true

    Quasar.actionSheet = modalFn(QActionSheet, Vue)
  }
}
