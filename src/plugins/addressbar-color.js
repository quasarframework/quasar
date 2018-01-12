import Platform from './platform'
import { ready } from '../utils/dom'
import { rgbToHex } from '../utils/colors'

function getPrimaryHex () {
  let tempDiv = document.createElement('div')
  tempDiv.style.height = '10px'
  tempDiv.style.position = 'absolute'
  tempDiv.style.top = '-100000px'
  tempDiv.className = 'bg-primary'
  document.body.appendChild(tempDiv)
  const primaryColor = window.getComputedStyle(tempDiv).getPropertyValue('background-color')
  document.body.removeChild(tempDiv)

  const rgb = primaryColor.match(/\d+/g)
  return `#${rgbToHex(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]))}`
}

function setColor (hexColor) {
  // http://stackoverflow.com/a/33193739
  let metaTag = document.createElement('meta')

  if (Platform.is.winphone) {
    metaTag.setAttribute('name', 'msapplication-navbutton-color')
  }
  else if (Platform.is.safari) {
    metaTag.setAttribute('name', 'apple-mobile-web-app-status-bar-style')
  }
  // Chrome, Firefox OS, Opera, Vivaldi
  else {
    metaTag.setAttribute('name', 'theme-color')
  }

  metaTag.setAttribute('content', hexColor)
  document.getElementsByTagName('head')[0].appendChild(metaTag)
}

export default {
  set (hexColor) {
    if (!Platform.is.mobile || Platform.is.cordova) {
      return
    }
    if (!Platform.is.winphone && !Platform.is.safari && !Platform.is.webkit && !Platform.is.vivaldi) {
      return
    }

    ready(() => {
      setColor(hexColor || getPrimaryHex())
    })
  }
}
