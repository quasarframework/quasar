export function filterArgvParams(argv) {
  const params = {}

  Object.keys(argv).forEach(key => {
    if (key.length > 1 && key !== 'help' && key !== 'noColor') {
      // kebab to camel case
      const prop = key.replaceAll(/(-\w)/g, m => m[1].toUpperCase())

      params[prop] = argv[key]
    }
  })

  return params
}
