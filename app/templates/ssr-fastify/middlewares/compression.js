import { ssrMiddleware } from 'quasar/wrappers'

export default ssrMiddleware(({ app }) => {
  app.register(require('fastify-compress'))
})
