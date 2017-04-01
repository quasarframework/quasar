import FastClick from 'fastclick'
import Platform from './platform'
import { ready } from '../utils/dom'

if (Platform.has.touch) {
  ready(() => {
    FastClick.attach(document.body)
  })
}
