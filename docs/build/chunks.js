const vendorRE =
  /node_modules[\\/](vue|@vue|quasar|vue-router)[\\/](.*)\.(m?js|css|sass)$/
const exampleRE =
  /examples:([a-zA-Z0-9]+)$|src[\\/]examples[\\/]([a-zA-Z0-9-]+)/

export const codeSplitting = {
  groups: [
    {
      test: vendorRE,
      name: 'vendor',
      priority: 20
    },

    {
      test: exampleRE,
      name(id) {
        const examplesMatch = exampleRE.exec(id)
        const name = examplesMatch[1] || examplesMatch[2]
        return `e.${name}`
      },
      priority: 10
    }
  ]
}
