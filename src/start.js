import Environment from './environment'

export default function (callback = function () {}) {
  if (Environment.runs.on.cordova) {
    var tag = document.createElement('script')

    document.addEventListener('deviceready', callback, false)

    tag.type = 'text/javascript'
    document.body.appendChild(tag)
    tag.src = 'cordova.js'

    return
  }

  callback()
}
