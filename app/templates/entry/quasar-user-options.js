/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding startup/initialization code.
 * Use "quasar new boot <name>" and add it there.
 * One boot file per concern. Then reference the file(s) in quasar.conf.js > boot:
 * boot: ['file', ...] // do not add ".js" extension to it.
 *
 * Boot files are your "main.js"
 **/
<%
const useStatement = [ `config: ${JSON.stringify(framework.config)}` ]

if (framework.lang) { %>
import lang from 'quasar/lang/<%= framework.lang %>'
<%
  useStatement.push('lang')
}

if (framework.iconSet) { %>
import iconSet from 'quasar/icon-set/<%= framework.iconSet %>'
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

export default { <%= useStatement.join(',') %> }
