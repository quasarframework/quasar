/* eslint-disable */
/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding startup/initialization code.
 * Use "quasar new boot <name>" and add it there.
 * One boot file per concern. Then reference the file(s) in quasar.config.js > boot:
 * boot: ['file', ...] // do not add ".js" extension to it.
 *
 * Boot files are your "main.js"
 **/
<%
const useStatement = [ `config: ${JSON.stringify(framework.config)}` ]

if (framework.lang) { %>
import lang from '<%= framework.lang %>'
<%
  useStatement.push('lang')
}

if (framework.iconSet) { %>
import iconSet from '<%= framework.iconSet %>'
<%
  useStatement.push('iconSet')
}
%>

<%
  let importStatement = []

  ;['components', 'directives', 'plugins'].forEach(type => {
    let items = framework[type]
    if (items.length > 0) {
      useStatement.push(type + ': {' + items.join(',') + '}')
      importStatement = importStatement.concat(items)
    }
  })

  if (importStatement.length > 0) {
%>
import <%= '{' + importStatement.join(',') + '}' %> from 'quasar'
<% } %>

<% if (framework.config.loading?.spinner || framework.config.notify?.spinner) { %>
const userOptions = { <%= useStatement.join(',') %> }
  <% if (framework.config.loading?.spinner) { %>
userOptions.config.loading.spinner = <%= framework.config.loading.spinner %>
  <% } %>
  <% if (framework.config.notify?.spinner) { %>
userOptions.config.notify.spinner = <%= framework.config.notify.spinner %>
  <% } %>
export default userOptions
<% } else { %>
export default { <%= useStatement.join(',') %> }
<% } %>
