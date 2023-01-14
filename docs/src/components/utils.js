const pathContainsQuery = (path, query) => {
  let queryParams = path.split('?')
  if (queryParams.length > 1) {
    queryParams = queryParams[ 1 ].split('&')
    return queryParams.includes(query)
  }
  return false
}

export {
  pathContainsQuery
}
