<% if (features.component) { %>import Component from './components/Component'<% } %>
<% if (features.directive) { %>import Directive from './directives/Directive'<% } %>

const version = __UI_VERSION__

function install (app) {
<% if (features.component) { %>  app.component(Component.name, Component)<% } %>
<% if (features.directive) { %>  app.directive(Directive.name, Directive)<% } %>
}

export {
  version,
<% if (features.component) { %>  Component,<% } %>
<% if (features.directive) { %>  Directive,<% } %>
  install
}
