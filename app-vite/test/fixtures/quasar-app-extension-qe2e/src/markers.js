/**
 * Single source for the values the app-vite test suites assert against
 * when driving this fixture extension. Consumed by the fixture's own
 * scripts AND by the tests (lib/cmd/ext.test.js, lib/cmd/run.test.js,
 * lib/app-extension/create-app-ext.test.js, test/playground-suite.js),
 * so a value change here propagates everywhere at once.
 */
export default {
  // index.js -> extendQuasarConf
  quasarConfMarker: 'qe2e-extension-active',
  // index.js -> extendViteConf html plugin
  viteHtmlMarker: '<!-- qe2e-vite-plugin-marker -->',
  // index.js -> registerCommand
  greetCommandOutput: 'qe2e greet command executed',
  // prompts.js answer, interpolated into the rendered template
  promptGreeting: 'Hello from qe2e prompts',
  // install.js / uninstall.js exit logs
  installExitLog: 'qe2e install script done',
  uninstallExitLog: 'qe2e uninstall script done',
  // the folder src/templates renders into the host app root
  // (also pinned in app-vite/.gitignore as playground-*/qe2e-rendered/)
  renderedDirName: 'qe2e-rendered'
}
