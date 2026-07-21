/* oxlint-disable */
/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 **/

export default function injectMiddlewares (opts) {
  return Promise.all([
<%
    const upperLen = quasarConf.ssr.middlewares.length - 1
    quasarConf.ssr.middlewares.forEach((asset, index) => { %>
    import('<%= asset.path %>')<%= index < upperLen ? ',' : '' %>
<% }) %>
  ]).then(async rawMiddlewares => {
    const middlewares = rawMiddlewares
      .map(entry => entry.default)

    for (let i = 0; i < middlewares.length; i++) {
      try {
        await middlewares[i](opts)
      }
      catch (err) {
        console.error('[Quasar SSR] middleware error:', err)
        return
      }
    }
  })
}
