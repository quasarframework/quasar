/**
 * Namespace to use for all packages
 * @type {string}
 */
const ns = process.env.PKG_NAMESPACE || '@quasar/cli'

/**
 * Fallback location for local packages/commands
 * @type {string}
 */
const localCmds = '../bin/quasar'

/**
 * Map a command to a source mapping of current and future
 * @param cmd
 * @param remote
 * @returns {{name: *, current: *, future: *}}
 */
function cmdMap (cmd, remote = false) {
  let meta = { name: cmd }
  if (!remote) {
    meta.current = `${localCmds}-${cmd}`
    meta.future = `${ns}-${cmd}`
  }
  else {
    meta.current = `${ns}-${cmd}`
  }
  return meta
}

/**
 * List of commands mapped to future: and current:
 * @type {{build, clean, dev, help, info, init, mode, new, serve, test}}
 */
const TOP_COMMANDS = {
  build: cmdMap('build'),
  clean: cmdMap('clean'),
  dev: cmdMap('dev'),
  help: cmdMap('help'),
  info: cmdMap('info'),
  init: cmdMap('init'),
  mode: cmdMap('mode'),
  new: cmdMap('new'),
  serve: cmdMap('serve'),
  create: cmdMap('create'),
  test: cmdMap('test', true)
}
module.exports = TOP_COMMANDS;
// const SERVICE_IDENTIFIER = {
//   BUILD: '@quasar/cli-build',
//   SERVE: '@quasar/cli-serve',
//   INFO: '@quasar/cli-info'
// };
//
// module.exports = SERVICE_IDENTIFIER;
