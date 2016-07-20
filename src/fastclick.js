import FastClick from 'fastclick'
import Environment from './environment'

if (Environment.runs.on.touch) {
  FastClick.attach(document.body)
}
