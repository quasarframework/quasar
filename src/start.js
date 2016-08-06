import $ from 'jquery'
import Platform from './platform'
import * as theme from './theme'

let list = []

list.push(Platform.is.desktop ? 'desktop' : 'mobile')
list.push(Platform.has.touch ? 'touch' : 'no-touch')

if (Platform.within.iframe) {
  list.push('within-iframe')
}

if (Platform.is.cordova) {
  list.push('cordova')
}

$('body').addClass(list.join(' '))

export default function (callback = function () {}) {
  if (!theme.current) {
    theme.set(Platform.is.ios ? 'ios' : 'mat')
  }

  /*
    if on Cordova, but not on an iframe,
    like on Quasar Play app
   */
  if (Platform.is.cordova && !Platform.within.iframe) {
    var tag = document.createElement('script')

    document.addEventListener('deviceready', callback, false)

    tag.type = 'text/javascript'
    document.body.appendChild(tag)
    tag.src = 'cordova.js'

    return
  }

  callback()
}
