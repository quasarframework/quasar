import component from './generator.component.js'
import composable from './generator.composable.js'
import directive from './generator.directive.js'
import plugin from './generator.plugin.js'
import util from './generator.util.js'
import generic from './generator.generic.js'

export function getGenerator (target) {
  if (/src[\\/]components/.test(target) === true) return component
  if (/src[\\/]composables/.test(target) === true) return composable
  if (/src[\\/]directives/.test(target) === true) return directive
  if (/src[\\/]plugins/.test(target) === true) return plugin
  if (/src[\\/]utils/.test(target) === true) return util
  return generic
}
