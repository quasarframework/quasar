import { QDialog } from '../components/dialog'
import { isSSR } from './platform'
import modalFn from '../utils/modal-fn'

export default {
  __installed: false,
  install ({ $q, Vue }) {
    if (this.__installed) { return }
    this.__installed = true

    this.create = $q.dialog = isSSR
      ? () => new Promise()
      : modalFn(QDialog, Vue)
  }
}
