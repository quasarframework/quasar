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
let useStatement = [ `config: ${JSON.stringify(framework.config)}` ]

if (framework.lang) { %>
import lang from 'quasar/lang/<%= framework.lang %>'
<%
  useStatement.push('lang: lang')
}

if (framework.iconSet) { %>
import iconSet from 'quasar/icon-set/<%= framework.iconSet %>'
<%
  useStatement.push('iconSet: iconSet')
}
%>

import Vue from 'vue'
<% if (framework.importStrategy === 'all') { %>
import Quasar from 'quasar'
<% } else {
  let importStatement = []

  ;['components', 'directives', 'plugins'].forEach(type => {
    let items = framework[type]
    if (items.length > 0) {
      useStatement.push(type + ': {' + items.join(',') + '}')
      importStatement = importStatement.concat(items)
    }
  })

  importStatement = '{Quasar' + (importStatement.length ? ',' + importStatement.join(',') : '') + '}'
%>
import <%= importStatement %> from 'quasar'
<% } %>

Vue.use(Quasar, { <%= useStatement.join(',') %> })
