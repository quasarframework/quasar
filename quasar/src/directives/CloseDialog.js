import ClosePopup from './ClosePopup.js'

export default {
  ...ClosePopup,
  name: 'close-dialog',
  bind (el, bindings, vnode) {
    const p = process.env
    if (p.PROD !== true) {
      console.info('\n\n[Quasar] info: please rename v-close-dialog (deprecated) with v-close-popup')
    }
    ClosePopup.bind(el, bindings, vnode)
  }
}
