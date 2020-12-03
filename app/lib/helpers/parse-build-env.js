const flat = require('flat')

module.exports = function parseBuildEnv (envDefinitions, rootDefinitions) {
  const env = {}

  const flatEnv = flat(envDefinitions)

  for (const key in flatEnv) {
    env[`process.env.${key}`] = JSON.stringify(flatEnv[key])
  }

  if (rootDefinitions !== void 0) {
    Object.assign(env, rootDefinitions)
  }

  return env
}
