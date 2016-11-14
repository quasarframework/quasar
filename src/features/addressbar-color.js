import Platform from './platform'
import Utils from '../utils'

if (Platform.is.mobile && !Platform.is.cordova) {
  Utils.dom.ready(() => {
    // add meta tag for mobile address bar coloring
    let tempDiv = document.createElement('div')
    tempDiv.style.height = '10px'
    tempDiv.style.position = 'absolute'
    tempDiv.style.top = '-100000px'
    tempDiv.className = 'bg-primary'
    document.body.appendChild(tempDiv)

    let primaryColor = window.getComputedStyle(tempDiv).getPropertyValue('background-color')

    document.body.removeChild(tempDiv)

    let rgb = primaryColor.match(/\d+/g)
    let hex = '#' + Utils.colors.rgbToHex(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]))

    // http://stackoverflow.com/a/33193739
    let metaTag = document.createElement('meta')

    if (Platform.is.winphone) {
      // <meta name="msapplication-navbutton-color" content="#4285f4">
      metaTag.setAttribute('name', 'msapplication-navbutton-color')
    }

    // Chrome, Firefox OS, Opera, Vivaldi
    if (Platform.is.webkit || Platform.is.vivaldi) {
      // <meta name="theme-color" content="#4285f4">
      metaTag.setAttribute('name', 'theme-color')
    }

    if (Platform.is.safari) {
      // <meta name="apple-mobile-web-app-status-bar-style" content="#4285f4">
      metaTag.setAttribute('name', 'apple-mobile-web-app-status-bar-style')
    }
    metaTag.setAttribute('content', hex)

    document.getElementsByTagName('head')[0].appendChild(metaTag)
  })
}
