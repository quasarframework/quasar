/* eslint-env node */
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

// cypress/plugins/index.js
const generateWebpackConfig = require("./../helpers/generateWebpackConfig");
const { startDevServer } = require("@cypress/webpack-dev-server");

module.exports = (on, config) => {
  on("dev-server:start", async (options) => {
    const webpackConfig = await generateWebpackConfig();
    return startDevServer({
      options,
      webpackConfig: webpackConfig.renderer,
    });
  });

  return config;
};
