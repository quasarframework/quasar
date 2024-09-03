import component from './generator.component.js'
import composable from './generator.composable.js'
import directive from './generator.directive.js'
import plugin from './generator.plugin.js'
import generic from './generator.generic.js'

export function getGenerator (target) {
  if (/use-[^\\/]+\.js$/.test(target) === true) return composable
  if (/src[\\/]components[\\/][^\\/]+[\\/]Q[^\\/]+\.js$/.test(target) === true) return component
  if (/src[\\/]directives[\\/][^\\/]+[\\/][^\\/]+\.js$/.test(target) === true) return directive
  if (/src[\\/]plugins[\\/][^\\/]+[\\/][^\\/]+\.js$/.test(target) === true) return plugin
  return generic
}

export { generic }
