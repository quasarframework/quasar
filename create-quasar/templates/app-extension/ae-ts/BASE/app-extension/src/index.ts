/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/index-api
 */

import { QuasarConfProxy as WebpackQuasarConfProxy } from '@quasar/app-webpack';
import { IndexAPI } from './quasar';

export default function (api: IndexAPI) {
  // Quasar compatibility check; you may need hard dependencies,
  // as in a minimum version of the "quasar" package or
  // a minimum version of "@quasar/app-*" CLI
  api.compatibleWith('quasar', '^2.0.0');

  if (api.hasVite) {
    api.compatibleWith('@quasar/app-vite', '^2.0.0');
  }

  if (api.hasWebpack) {
    api.compatibleWith('@quasar/app-webpack', '^4.0.0');
  }

  api.extendQuasarConf((conf, api) => {
    conf.boot!.push('~<%= pkgName %>/boot/register');

    // make sure app extension files get transpiled
    if (api.hasWebpack) {
      const config = conf as unknown as WebpackQuasarConfProxy;
      config.build.webpackTranspileDependencies.push(
        /<%= pkgName.replace('/', '[\\\\/]') %>[\\/]dist/,
      );
    }
  });
}
