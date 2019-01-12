<template lang="pug">
doc-page(
  title="Getting Started - Pick Quasar Flavour"
)
  div <strong>If you would like to learn what Quasar is all about and what it can do for you</strong>, read the <doc-link to="/introduction-to-quasar">Introduction to Quasar</doc-link> page. Otherwise, let’s get started by choosing how you’d like to use Quasar. There are three methods for using Quasar:

  ul
    li UMD/Standalone (embed into an existing project through CDN, progressive integration)
    li Development with Quasar CLI (<strong>the premium developer experience, recommended</strong>)
    li Vue CLI 3 plugin

  div Here's a quick comparison:

  q-markup-table.full-width
    thead
      tr
        th.text-left Feature
        th.text-left UMD
        th.text-left Quasar CLI
        th.text-left Vue CLI 3 Plugin
    tbody
      tr
        td Ability to embed into an existing project
        td Yes
        td -
        td Yes, if it is Vue CLI app
      tr
        td Progressive integration of Quasar
        td Yes
        td -
        td -
      tr
        td Ability to serve Quasar from CDN
        td Yes
        td -
        td -
      tr
        td Build SPA, PWA
        td Yes
        td Yes
        td Yes
      tr
        td Build SSR (+ optional PWA client takeover)
        td -
        td Yes
        td (??)
      tr
        td Build Mobile Apps, Electron Apps
        td Yes
        td Yes
        td (??)
      tr
        td Dynamic RTL support for Quasar components
        td Yes
        td Yes
        td Yes
      tr
        td Generating your own website/app RTL equivalent CSS rules automatically by Quasar
        td -
        td Yes
        td Yes
      tr
        td One codebase for SPA, PWA, Mobile Apps, Electron Apps
        td -
        td Yes
        td -
      tr
        td Tree Shaking
        td -
        td Yes
        td Yes
      tr
        td SFC (Single File Component - for Vue)
        td -
        td Yes
        td Yes
      tr
        td Advanced configuration through dynamic quasar.conf.js
        td -
        td Yes
        td -
      tr
        td Unit & end to end testing
        td -
        td Not yet
        td Yes

  doc-section.h1(title="UMD / Standalone (uses CDN)")
  div If you’d like to embed Quasar into your existing website project, integrating it in a progressive manner, then go for the UMD/Standalone (Unified Module Definition) version. For more details, head on to its<doc-link to="/getting-started/umd">documentation page</doc-link>.

  doc-section.h1(title="Development with Quasar CLI (The best developer experience)")
  div If you want to be able to build:
  ul
    li a SPA (Single Page Application/Website),
    li a SSR (Server-side Rendered App/Website),
    li a PWA (Progressive Web App),
    li a Mobile App (through Cordova),
    li an Electron App,
  div ...and
  ul
    li benefit from from a faster developement workflow provided by the Quasar CLI, with HMR (Hot Module Reload)
    li <strong>hare the same base-code for all those modes</strong>
    li benefit from the latest web recommended practices out of the box
    li ability to write ES6 code
    li benefit from Tree Shaking
    li get your code optimized, minified, bundled in the best possible way
    li ability to write SFC (Single File Component - for Vue)
  div ...then go for the best developer experience:

  div First, we will need to install the Quasar CLI. Make sure you have Node >=8 and NPM >=5 or Yarn installed on your machine.
  code-markup(lang="bash")
    | # Node.js >= 8.9.0 is required.
    | $ npm install -g @quasar/cli // recommended
    | # or:
    | $ yarn global add @quasar/cli

  div With Quasar CLI globally installed, we can now create a new project:
  code-markup(lang="bash")
    | $ quasar create _folder_

  div Note that you don’t need different projects, in order to build any one of the application options described above. This one project folder can seamlessly handle all of them.

  div For more details, head on to its<doc-link to="/getting-started/quasar-cli">documentation page</doc-link>. With this knowledge under your belt, you’ll be able to take full advantage of all of Quasar CLI’s many great features.

  doc-section.h1(title="Vue CLI 3 Plugin")

  div To work with Quasar via a Vue CLI plugin, you will need to make sure you have vue-cli 3.x.x installed globally. To make sure you have Vue CLI 3.0, use this command:
  code-markup(lang="bash")
    | $ vue --version

  div You should see something like:
  code-markup(lang="bash")
    | $ vue --version
    | 3.2.3

  div Should you have Vue CLI 2.x.x. installed, you’ll need to uninstall it with:
  code-markup(lang="bash")
    | $ npm uninstall -g vue-cli
    | # or:
    | $ yarn global remove vue-cli

  div and then install Vue CLI 3.0 as follows:
  code-markup(lang="bash")
    | $ yarn global add @vue/cli
    | # or:
    | $ npm install -g @vue/cli

  div If you don’t yet have a project created with vue-cli 3.x, then do so with:
  code-markup(lang="bash")
    | $ vue create my-app

  div Navigate to the newly created project folder and add the cli plugin. Before installing it, make sure to commit your current changes should you wish to revert them later.
  code-markup(lang="bash")
    | $ cd my-app
    | $ vue add quasar

  div The CLI will ask you if you want the plugin to replace some existing files. It is recommended that you do this, if you wish to have an example, so you can quickly develop your app.

  div Your Vue config (in package.json or vue.config.js file, depending on what you chose when you created your vue app) will also contain a <doc-token>quasar</doc-token> object which holds some basic Quasar configuration options.

  div For more details, head on to its<doc-link to="/getting-started/vue-cli-plugin">documentation page</doc-link>.
</template>

<script>
export default {
  name: 'PickFlavourPage',

  meta: {
    title: 'Pick Quasar Flavour'
  }
}
</script>
