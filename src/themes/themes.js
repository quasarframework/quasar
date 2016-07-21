import $ from 'jquery'
import Environment from '../environment'

const body = $('body')
let
  list = [],
  theme = Environment.runs.on.ios ? 'ios' : 'mat'

list.push(theme)
list.push(Environment.runs.on.desktop ? 'desktop' : 'mobile')
list.push(Environment.runs.with.touch ? 'touch' : 'no-touch')

if (Environment.runs.within.iframe) {
  list.push('within-iframe')
}

if (Environment.runs.on.cordova) {
  list.push('cordova')
}

body.addClass(list.join(' '))

export default theme
