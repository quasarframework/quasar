/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/index-api
 */

function extendConf (conf) {
  // register our boot file
  conf.boot.push('~quasar-app-extension-<%= name %>/src/boot/register.js')

  // make sure app extension files & ui package gets transpiled
  conf.build.transpileDependencies.push(/quasar-app-extension-<%= name %>[\\/]src/)

  // make sure the stylesheet goes through webpack to avoid SSR issues
  conf.css.push('~quasar-ui-<%= name %>/src/index.sass')
}

module.exports = function (api) {
  // Quasar compatibility check; you may need
  // hard dependencies, as in a minimum version of the "quasar"
  // package or a minimum version of "@quasar/app" CLI
  api.compatibleWith('quasar', '^1.1.1')
  api.compatibleWith('@quasar/app', '^2.0.0')

<% if (features.component) { %>
  // Uncomment the line below if you provide a JSON API for your component
  // api.registerDescribeApi('<%= componentName %>', '~quasar-ui-<%= name %>/src/components/<%= componentName %>.json')
<% } %><% if (features.directive) { %>
  // Uncomment the line below if you provide a JSON API for your directive
  // api.registerDescribeApi('<%= directiveName %>', '~quasar-ui-<%= name %>/src/directives/<%= directiveName %>.json')
<% } %>

  // We extend /quasar.conf.js
  api.extendQuasarConf(extendConf)
}
