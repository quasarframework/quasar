import component from './generator.component.js'
import composable from './generator.composable.js'
import directive from './generator.directive.js'
import plugin from './generator.plugin.js'
// oxlint-disable-next-line unicorn/prefer-export-from
import generic from './generator.generic.js'

const useRE = /use-[^\\/]+\.js$/
const componentsRE = /src[\\/]components[\\/][^\\/]+[\\/]Q[^\\/]+\.js$/
const directivesRE = /src[\\/]directives[\\/][^\\/]+[\\/][^\\/]+\.js$/
const pluginsRE = /src[\\/]plugins[\\/][^\\/]+[\\/][^\\/]+\.js$/

export function getGenerator(target) {
  if (useRE.test(target)) return composable
  if (componentsRE.test(target)) return component
  if (directivesRE.test(target)) return directive
  if (pluginsRE.test(target)) return plugin
  return generic
}

export { generic }
