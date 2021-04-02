// This middleware should execute as last one
// since it captures everything and tries to
// render the page with Vue

export default ({ app, resolveUrl, render }) => {
  app.get(resolveUrl('*'), (req, res) => {
    res.setHeader('Content-Type', 'text/html')

    render.vue({ req, res })
      .then(html => {
        res.send(html)
      })
      .catch(err => {
        console.log('render.js renderVue callback ERR')
        if (err.url) {
          if (err.code) {
            res.redirect(err.code, err.url)
          }
          else {
            res.redirect(err.url)
          }
        }
        else if (err.code === 404) {
          // Should reach here only if no "catch-all" route
          // is defined in /src/routes
          res.status(404).send('404 | Page Not Found')
        }
        // TODO process.env.DEV
        else if (render.error !== void 0) {
          // Available while on dev only
          render.error({ err, req, res })
        }
        else {
          // Render Error Page on production or
          // create a route (/src/routes) for an error page and redirect to it
          res.status(500).send('500 | Internal Server Error')
        }
      })
  })
}
