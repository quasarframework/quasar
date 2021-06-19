
const directives = {}
const extractName = key => {
  return key.substring(2, key.length - 3)
}

function getDirectives (request) {
  return request.keys().forEach(key => {
    directives[ extractName(key) ] = request(key).default
  })
}

getDirectives(
  require.context('src-ssr/directives', false, /\.(js|ts)$/, 'sync')
)

export default directives
