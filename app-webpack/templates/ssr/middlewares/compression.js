import compression from 'compression'
import { ssrMiddleware } from 'quasar/wrappers'

export default ssrMiddleware(({ app }) => {
  app.use(
    compression({ threshold: 0 })
  )
})
