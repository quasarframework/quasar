---
title: Configuring Electron
desc: (@quasar/app-vite) How to manage your Electron apps with Quasar CLI.
related:
  - /quasar-cli-vite/quasar-config-file
---

Electron mode is selected with the `--mode electron` option for `quasar dev` and `quasar build`. Its main process, preload scripts, packaging, and publishing behavior are configured in `quasar.config`.

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
   * The list of preload scripts (js/ts) that you want compiled.
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
   * Run after production dependencies are installed in UnPackaged and
   * before the selected Electron bundler runs.
   */
  beforePackaging?: (context: {
    readonly appPaths: QuasarAppPaths;
    readonly unpackagedDir: string;
  }) => void | Promise<void>;

  /**
   * Extend the Rolldown config that is used for the Electron main process.
   *
   * Can be async. Can directly modify the "config" parameter or
   * return a new one that will be merged with the default one.
   */
  extendElectronMainConf?: (
    config: RolldownOptions
  ) => void | RolldownOptions | Promise<void | RolldownOptions>;

  /**
   * Extend the Rolldown config that is used for Electron preload scripts.
   *
   * Can be async. Can directly modify the "config" parameter or
   * return a new one that will be merged with the default one.
   */
  extendElectronPreloadConf?: (
    config: RolldownOptions
  ) => void | RolldownOptions | Promise<void | RolldownOptions>;

  /**
   * Choose either packager or builder. Packager creates an application
   * bundle; builder can also create installers, sign, and publish artifacts.
   */
  bundler?: "packager" | "builder";
  packager?: Omit<ElectronPackager.Options, "dir" | "out">;
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

The `packager` property accepts [@electron/packager options](https://electron.github.io/packager/main/), except `dir` and `out`, which Quasar controls.

The `builder` property accepts [electron-builder options](https://www.electron.build/configuration).

To extend the renderer process (the UI in `/src`) Vite configuration:

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

## Packager vs Builder

`@electron/packager` creates an application bundle and is the Quasar default. `electron-builder` adds installer targets, code-signing integration, and publishing. Both tools have target-specific host restrictions; code signing and native dependencies often require building on the target operating system.

## Dependencies optimization

The production package uses the `dependencies` from `/src-electron/package.json`. They are installed in `/dist/electron/UnPackaged` before packaging.

Keep renderer-only dependencies in the root package and Electron runtime dependencies in `/src-electron/package.json`. Preload imports are bundled, but a sandboxed preload cannot use arbitrary Node.js APIs or native modules; move privileged work to the main process and expose a narrow IPC API.

Use `electron.extendElectronPackageJson(pkgJson)` only when the generated production manifest needs additional adjustment. Removing a dependency required by externalized main-process code will make the packaged application fail at runtime.
