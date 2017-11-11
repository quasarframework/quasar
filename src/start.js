import { Vue } from './deps'
import Platform from './features/platform'
import throttle from './utils/throttle'

export default function (cb = function () {}) {
  // Handle detecting when the mobile keyboard is open or close including logic to handle device orientation changes.
  if (Platform.is.mobile) {
    var initialScreenHeight = window.innerHeight
    var initialScreenWidth = window.innerWidth

    window.addEventListener('resize', throttle(function () {
      if (window.innerWidth !== initialScreenWidth) {
        initialScreenHeight = window.innerHeight
        initialScreenWidth = window.innerWidth
      }
      else {
        let isOpen = (window.innerHeight < initialScreenHeight)
        if (Vue.prototype.$isKeyboardOpen !== isOpen) {
          Vue.prototype.$isKeyboardOpen = isOpen
        }
      }
    }, false), 100)
  }

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
