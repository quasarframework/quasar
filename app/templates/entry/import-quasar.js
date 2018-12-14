/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding initialization code.
 * Use "quasar new plugin <name>" and add it there.
 * One plugin per concern. Then reference the file(s) in quasar.conf.js > plugins:
 * plugins: ['file', ...] // do not add ".js" extension to it.
 **/
<%
let useStatement = [ `config: ${JSON.stringify(framework.config)}` ]

if (framework.i18n) { %>
import lang from 'quasar/i18n/<%= framework.i18n %>'
<%
  useStatement.push('i18n: lang')
}

if (framework.iconSet) { %>
import iconSet from 'quasar/icons/<%= framework.iconSet %>'
<%
  useStatement.push('iconSet: iconSet')
}
%>

import Vue from 'vue'
<% if (framework.all) { %>
import Quasar from 'quasar'
<% } else {
  let importStatement = []

  ;['components', 'directives', 'plugins'].forEach(type => {
    if (framework[type]) {
      let items = framework[type].filter(item => item)
      if (items.length > 0) {
        useStatement.push(type + ': {' + items.join(',') + '}')
        importStatement = importStatement.concat(items)
      }
    }
  })

  importStatement = '{Quasar' + (importStatement.length ? ',' + importStatement.join(',') : '') + '}'
%>
import <%= importStatement %> from 'quasar'
<% } %>

Vue.use(Quasar, { <%= useStatement.join(',') %> })
