<img src="https://img.shields.io/npm/v/quasar-ui-<%= name %>.svg?label=quasar-ui-<%= name %>">
<% if (features.ae) { %><img src="https://img.shields.io/npm/v/quasar-app-extension-<%= name %>.svg?label=quasar-app-extension-<%= name %>"><% } %>

Compatible with Quasar UI v1 and Vue 2.

# Structure
* [/ui](ui) - standalone npm package
<% if (features.ae) { %>
* [/app-extension](app-extension) - Quasar app extension
<% } %>

# Donate
If you appreciate the work that went into this project, please consider [donating to Quasar](https://donate.quasar.dev).

# License
<%= license %> (c) <%= author %>
