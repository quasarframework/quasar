import { QDialog } from '../components/dialog'
import { isSSR } from './platform'
import modalFn from '../utils/modal-fn'
import log from '../utils/log'

export default {
  __installed: false,
  create () {
    log.error('You must include Dialog inside quasar.conf before using it.')
  },
  install ({ $q, Vue }) {
    if (this.__installed) { return }
    this.__installed = true

    this.create = $q.dialog = isSSR
      ? () => new Promise()
      : modalFn(QDialog, Vue)
  }
}
