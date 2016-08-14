import FastClick from 'fastclick'
import Platform from './platform'

if (Platform.has.touch) {
  FastClick.attach(document.body)
}
