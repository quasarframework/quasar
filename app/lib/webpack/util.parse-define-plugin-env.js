
module.exports = function parseDefinePluginEnv (definition) {
  const env = {}

  for (const key in definition) {
    const entry = definition[key]
    env[key] = Object(entry) === entry
      ? parseDefinePluginEnv(entry)
      : JSON.stringify(definition[key])
  }

  return env
}
