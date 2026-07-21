/* oxlint-disable */
/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding startup/initialization code.
 * Use "quasar new boot <name>" and add it there.
 * One boot file per concern. Then reference the file(s) in quasar.config file > boot:
 * boot: ['file', ...] // do not add ".js" extension to it.
 *
 * Boot files are your "main.js"
 **/
<%
const useStatement = [ `config: ${JSON.stringify(quasarConf.framework.config)}` ]

if (quasarConf.framework.lang) { %>
import lang from '<%= quasarConf.framework.lang %>'
<%
  useStatement.push('lang')
}

if (quasarConf.framework.iconSet) { %>
import iconSet from '<%= quasarConf.framework.iconSet %>'
<%
  useStatement.push('iconSet')
}
%>

<%
  let importStatement = []

  ;['components', 'directives', 'plugins'].forEach(type => {
    let items = quasarConf.framework[type]
    if (items.length !== 0) {
      useStatement.push(type + ': {' + items.join(',') + '}')
      importStatement = importStatement.concat(items)
    }
  })

  if (importStatement.length !== 0) {
%>
import <%= '{' + importStatement.join(',') + '}' %> from 'quasar'
<% } %>

<% if (quasarConf.framework.config.loading?.spinner || quasarConf.framework.config.notify?.spinner) { %>
const userOptions = { <%= useStatement.join(',') %> }
<% if (quasarConf.framework.config.loading?.spinner) { %>
userOptions.config.loading.spinner = <%= quasarConf.framework.config.loading.spinner %>
<% } %>

<% if (quasarConf.framework.config.notify?.spinner) { %>
userOptions.config.notify.spinner = <%= quasarConf.framework.config.notify.spinner %>
<% } %>

export default userOptions
<% } else { %>
export default { <%= useStatement.join(',') %> }
<% } %>
