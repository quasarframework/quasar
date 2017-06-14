import { Vue } from './deps'
import Platform from './features/platform'

export default function (cb = function () {}) {
  /*
    if on Cordova, but not on an iframe,
    like on Quasar Play app
   */
  if (!Platform.is.cordova || Platform.within.iframe) {
    cb()
    return
  }

  const tag = document.createElement('script')

  document.addEventListener('deviceready', () => {
    Vue.prototype.$cordova = cordova
    cb()
  }, false)

  tag.type = 'text/javascript'
  document.body.appendChild(tag)
  tag.src = 'cordova.js'
}
