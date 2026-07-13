---
title: Configuring Electron
desc: (@quasar/app-vite) How to manage your Electron apps with Quasar CLI.
related:
  - /quasar-cli-vite/quasar-config-file
---

We'll be using Quasar CLI (and Cordova CLI) to develop and build a Mobile App. The difference between building a SPA, PWA, SSR, SSG, Electron App or a Mobile App is simply determined by the "mode" parameter in "quasar dev" and "quasar build" commands.

But first, let's learn how we can configure the Electron build.

## quasar.config file

```ts /quasar.config file > sourceFiles
// should you wish to change default files
// (notice no extension, so it resolves to both .js and .ts)
sourceFiles: {
  electronMain?: 'src-electron/electron-main',
}
```

```ts /quasar.config file > electron
electron: {
  /**
   * The list of content scripts (js/ts) that you want embedded.
   * Each entry in the list should be a filename (WITHOUT its extension) from /src-electron/
   *
   * @default [ 'electron-preload' ]
   * @example [ 'my-other-preload-script' ]
   */
  preloadScripts?: string[];

  /**
   * Add/remove/change properties of Electron production generated package.json
   *
   * Can be async. Can directly modify the "pkgJson" parameter or
   * return a new one that will be merged with the default one.
   */
  extendElectronPackageJson?: (pkgJson: { [index in string]: any }) =>
    | void
    | { [index in string]: any }
    | Promise<void | { [index in string]: any }>;

  /**
   * Extend the Rolldown config that is used for the electron-main thread.
   *
   * Can be async. Can directly modify the "config" parameter or
   * return a new one that will be merged with the default one.
   */
  extendElectronMainConf?: (
    config: RolldownOptions
  ) => void | RolldownOptions | Promise<void | RolldownOptions>;

  /**
   * Extend the Rolldown config that is used for the electron-preload thread.
   *
   * Can be async. Can directly modify the "config" parameter or
   * return a new one that will be merged with the default one.
   */
  extendElectronPreloadConf?: (
    config: RolldownOptions
  ) => void | RolldownOptions | Promise<void | RolldownOptions>;

  /**
   * You have to choose to use either packager or builder.
   * They are both excellent open-source projects,
   *  however they serve slightly different needs.
   * With packager you will be able to build unsigned projects
   *  for all major platforms from one machine.
   * Although this is great, if you just want something quick and dirty,
   *  there is more platform granularity (and general polish) in builder.
   * Cross-compiling your binaries from one computer doesn’t really work with builder,
   *  or we haven’t found the recipe yet.
   */
  // This property definition is here merely to avoid duplicating the TSDoc
  // It should not be optional, as TS cannot infer the discriminated union based on the absence of a field
  // Futhermore, making it optional here won't change the exported interface which is the union
  // of the two derivate interfaces where `bundler` is set without optionality
  bundler?: "packager" | "builder";
  packager?: ElectronPackager.Options;
  builder?: ElectronBuilder.Configuration;

  /**
   * Specify additional parameters when installing dependencies in
   * the UnPackaged folder, right before bundling with either
   * electron packager or electron builder;
   * Example: [ 'install', '--production', '--ignore-optional', '--some-other-param' ]
   */
  unPackagedInstallParams?: string[];

  /**
   * Specify the debugging port to use for the Electron app when running in development mode
   * @default 5858
   */
  inspectPort?: number;
}
```

The "packager" prop refers to [@electron/packager options](https://electron.github.io/packager/main/). The `dir` and `out` properties are overwritten by Quasar CLI to ensure the best results.

The "builder" prop refers to [electron-builder options](https://www.electron.build/configuration).

Should you want to tamper with the "Renderer" thread (UI in /src) Vite config:

```js /quasar.config file
export default defineConfig(ctx => {
  return {
    build: {
      extendViteConf(viteConf) {
        if (ctx.mode.electron) {
          // do something with viteConf
          // or return an object to deeply merge with current viteConf
        }
      }
    }
  }
})
```

## Packager vs. Builder

You have to choose to use either packager or builder. They are both excellent open-source projects, however they serve slightly different needs. With packager you will be able to build unsigned projects for all major platforms from one machine (with restrictions). Although this is great, if you just want something quick and dirty, there is more platform granularity (and general polish) in builder. Cross-compiling your binaries from one computer doesn't really work with builder (or we haven't found the recipe yet...)

## Dependencies optimization

By default, all `dependencies` from your root `package.json` file get installed and embedded into the production executable.

This means that it will also include your UI-only deps, which are already bundled in the UI files (so it will duplicate them). From our CLI perspective, we don't have any generic way of telling whether a dependency is UI only or if it's used by the main/preload scripts, so we cannot reliably auto-remove them.

However, you can do this by using quasar.conf > electron > extendElectronPackageJson(pkgJson) and overwriting or tampering with the `dependencies` key from your `package.json` file. If you leave only the main & preload threads depdendencies then this will lead to a smaller production executable file.
