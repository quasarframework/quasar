const
  { log, fatal } = require('./logger')
  spawn = require('cross-spawn')

module.exports = function (cmd, params, cwd) {
  log(`Running "${cmd} ${params.join(' ')}"`)
  console.log()

  const runner = spawn.sync(
    cmd,
    params,
    { stdio: 'inherit', stdout: 'inherit', stderr: 'inherit', cwd }
  )

  if (runner.status || runner.error) {
    console.log()
    fatal(`⚠️  Command "${cmd}" failed with exit code: ${runner.status}`)
  }
}
