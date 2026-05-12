/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/index-api
 */

import type { IndexAPI } from '@quasar/app-vite';

export default function (api: IndexAPI) {
  // Quasar compatibility check; you may need hard dependencies,
  // as in a minimum version of the "quasar" package or
  // a minimum version of "@quasar/app-vite" CLI
  api.compatibleWith('quasar', '^2.0.0');
  api.compatibleWith('@quasar/app-vite', '^3.0.0-0');

  api.extendQuasarConf((conf) => {
    conf.boot!.push('~<%= scope.pkgName %>/boot/register');
  });
}
