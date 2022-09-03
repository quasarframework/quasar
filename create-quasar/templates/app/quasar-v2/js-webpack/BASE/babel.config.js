/* eslint-disable */

module.exports = api => {
  return {
    <% if (preset.jsx) { %>plugins: ['@vue/babel-plugin-jsx'],<% } %>
    presets: [
      [
        '@quasar/babel-preset-app',
        api.caller(caller => caller && caller.target === 'node')
          ? { targets: { node: 'current' } }
          : {}
      ]
    ]
  }
}
