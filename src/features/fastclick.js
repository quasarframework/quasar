import FastClick from 'fastclick'
import Platform from './platform'
import Utils from '../utils'

if (Platform.has.touch) {
  Utils.dom.ready(() => {
    FastClick.attach(document.body)
  })
}
