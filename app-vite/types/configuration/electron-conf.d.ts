import type * as ElectronBuilderUtil from "builder-util";
import type * as ElectronBuilder from "electron-builder";
import type * as ElectronPackager from "@electron/packager";
import type { LiteralUnion } from "quasar";
import type { RolldownOptions } from "rolldown";
import type { QuasarAppPaths } from "../app-paths.d.ts";

export type QuasarElectronBundlers = "builder" | "packager";

type ElectronBuilderConfiguration = ElectronBuilder.Configuration;
type ElectronPackagerOptions = ElectronPackager.Options;

interface QuasarElectronConfiguration {
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
   * Run after the production dependencies have been installed in the
   * UnPackaged directory and before the selected Electron bundler runs.
   *
   * Can be async.
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
   *
   * @param config {@link RolldownOptions}
   */
  extendElectronMainConf?: (
    config: RolldownOptions
  ) => void | RolldownOptions | Promise<void | RolldownOptions>;

  /**
   * Extend the Rolldown config that is used for Electron preload scripts.
   *
   * Can be async. Can directly modify the "config" parameter or
   * return a new one that will be merged with the default one.
   *
   * @param config {@link RolldownOptions}
   */
  extendElectronPreloadConf?: (
    config: RolldownOptions
  ) => void | RolldownOptions | Promise<void | RolldownOptions>;

  /**
   * You have to choose to use either "packager" or "builder".
   * They serve different needs: packager creates an application bundle,
   * while builder can also create installers, sign, and publish artifacts.
   * Host-platform restrictions still apply to signing and some targets.
   *
   * Use along with either the `packager` or `builder` property to
   * configure the options for the chosen bundler.
   *
   * @type options {@link QuasarElectronBundlers}
   * @default "packager"
   */
  bundler?: QuasarElectronBundlers;

  /**
   * Electron-packager options.
   * `dir` and `out` properties are overwritten by Quasar CLI to ensure the best results.
   * @type options {@link ElectronPackagerOptions}
   */
  packager?: Omit<ElectronPackagerOptions, "dir" | "out">;

  /**
   * Electron-builder options
   * @type options {@link ElectronBuilderConfiguration}
   */
  builder?: ElectronBuilderConfiguration;

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

export type ElectronBuilderArchs = ElectronBuilderUtil.Arch;
// ElectronBuilder doesn't export exact types for the target option
export type ElectronBuilderTargets =
  | "all"
  | "darwin"
  | "win32"
  | "linux"
  | "win"
  | "mac";

export type ElectronPackagerArchs = LiteralUnion<
  ElectronPackager.OfficialArch | "all"
>;
export type ElectronPackagerTargets = LiteralUnion<
  ElectronPackager.OfficialPlatform | "all"
>;
