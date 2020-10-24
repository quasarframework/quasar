module.exports = function parseBuildEnv (envDefinitions, rootDefinitions) {
  const env = {}

  for (const key in envDefinitions) {
    env[`process.env.${key}`] = JSON.stringify(envDefinitions[key])
  }

  if (rootDefinitions !== void 0) {
    Object.assign(env, rootDefinitions)
  }

  return env
}
