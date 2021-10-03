import { ssrMiddleware } from 'quasar/wrappers'
// import zlib from 'zlib'

export default ssrMiddleware(({ app }) => {
  app.register(
    require('fastify-compress'),
    // {
    //   threshold: 1048,
    //   global: true,
    //   brotliOptions: {
    //     params: {
    //       [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT, // useful for APIs that primarily return text
    //       [zlib.constants.BROTLI_PARAM_QUALITY]: 11, // default is 11, max is 11, min is 0
    //     },
    //   },
    //   zlibOptions: {
    //     level: 9, // default is 9, max is 9, min is 0
    //   }
    // }
  )
})
