/**
 * Quasar App Extension install script
 * (runs on `quasar ext add {name}` and `quasar ext invoke {name}`)
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/install-api
 */

import { InstallAPI } from './quasar';

export default function (api: InstallAPI) {
  // Quasar compatibility check; you may need hard dependencies,
  // as in a minimum version of the "quasar" package or
  // a minimum version of "@quasar/app-*" CLI
  api.compatibleWith('quasar', '^2.0.0');

  if (api.hasVite) {
    api.compatibleWith('@quasar/app-vite', '^2.0.0-beta.1');
  }

  if (api.hasWebpack) {
    api.compatibleWith('@quasar/app-webpack', '^4.0.0-beta.1');
  }

  api.render('./templates/base', api.prompts);
}
