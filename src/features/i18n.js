import { Vue } from '../deps'

export function set (i18n) {
  if (Vue.prototype.$q === void 0) {
    console.error('Trying to set Quasar i18n before Vue.use(Quasar).')
    return
  }
  Vue.prototype.$q.i18n = i18n
}
