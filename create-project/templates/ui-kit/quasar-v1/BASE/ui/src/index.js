import { version } from '../package.json'

<% if (features.component) { %>import Component from './components/Component'<% } %>
<% if (features.directive) { %>import Directive from './directives/Directive'<% } %>

export {
  version,

  <% if (features.component) { %>Component<% if (features.directive) { %>,<% } } %>
  <% if (features.directive) { %>Directive<% } %>
}

export default {
  version,

  <% if (features.component) { %>Component,<% } %>
  <% if (features.directive) { %>Directive,<% } %>

  install (Vue) {
    <% if (features.component) { %>Vue.component(Component.name, Component)<% } %>
    <% if (features.directive) { %>Vue.directive(Directive.name, Directive)<% } %>
  }
}
