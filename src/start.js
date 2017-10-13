import { Vue } from './deps'
import Platform from './features/platform'
import throttle from './utils/throttle'

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

  if (Platform.is.mobile) {
    const initialScreenHeight = window.innerHeight

    window.addEventListener('resize', throttle(() => {
      Vue.prototype.$isKeyboardOpen = (window.innerHeight < initialScreenHeight)
    }, false), 100)
  }

  tag.type = 'text/javascript'
  document.body.appendChild(tag)
  tag.src = 'cordova.js'
}
