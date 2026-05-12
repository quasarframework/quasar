/**
 * Quasar App Extension install script
 * (runs on `quasar ext add {name}` and `quasar ext invoke {name}`)
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/install-api
 */

import type { InstallAPI } from '@quasar/app-vite';

export default function (api: InstallAPI) {
  api.compatibleWith('quasar', '^2.0.0');
  api.compatibleWith('@quasar/app-vite', '^3.0.0-0');

  api.render('./templates/base', api.prompts);
}
