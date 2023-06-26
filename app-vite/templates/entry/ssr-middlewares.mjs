/* eslint-disable */
/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 **/

export default function injectMiddlewares (opts) {
  return Promise.all([
    <% ssr.middlewares.forEach((asset, index) => { %>
    import('<%= asset.path %>')<%= index < ssr.middlewares.length - 1 ? ',' : '' %>
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
