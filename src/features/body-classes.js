import Platform from './platform'
import Utils from '../utils'

function addClass (className) {
  document.body.classList.add(className)
}

Utils.dom.ready(() => {
  addClass(Platform.is.desktop ? 'desktop' : 'mobile')
  addClass(Platform.has.touch ? 'touch' : 'no-touch')

  if (Platform.within.iframe) {
    addClass('within-iframe')
  }

  if (Platform.is.cordova) {
    addClass('cordova')
  }
})
