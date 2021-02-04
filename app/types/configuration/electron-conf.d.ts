import { Configuration as ElectronBuilderConfiguration } from "electron-builder";
import {
  arch,
  Options as ElectronPackagerOptions,
  platform
} from "electron-packager";
import * as WebpackChain from "webpack-chain";
import { WebpackConfiguration } from "../ts-helpers";

export type QuasarElectronBundlersInternal = "builder" | "packager";

interface QuasarBaseElectronConfiguration {
  /**
   * @version `@quasar/app` 1.9.6+
   *
   * Add/remove/change properties of production generated package.json
   */
  extendPackageJson?: (pkg: { [index in string]: any }) => void;
  /** Webpack config object for the Main Process ONLY (`/src-electron/main-process/`) */
  extendWebpack?: (config: WebpackConfiguration) => void;
  /**
   * Equivalent to `extendWebpack()` but uses `webpack-chain` instead,
   *  for the Main Process ONLY (`/src-electron/main-process/`)
   */
  chainWebpack?: (chain: WebpackChain) => void;

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
  bundler: QuasarElectronBundlersInternal;
}

interface QuasarElectronPackagerConfiguration
  extends QuasarBaseElectronConfiguration {
  bundler: "packager";

  /**
   * Electron-packager options.
   * `dir` and `out` properties are overwritten by Quasar CLI to ensure the best results.
   */
  packager?: Omit<ElectronPackagerOptions, "dir" | "out">;
}

interface QuasarElectronBuilderConfiguration
  extends QuasarBaseElectronConfiguration {
  bundler: "builder";

  /** Electron-builder options */
  builder?: ElectronBuilderConfiguration;
}

export type QuasarElectronBundlers = QuasarElectronBundlersInternal;

export type ElectronBuilderArchs = "ia32" | "x64" | "armv7l" | "arm64" | "all";

export type ElectronBuilderTargets =
  | "darwin"
  | "mac"
  | "win32"
  | "win"
  | "linux"
  | "all";

export type ElectronPackagerArchs = arch;
export type ElectronPackagerTargets = platform;

export type QuasarElectronConfiguration =
  | QuasarElectronPackagerConfiguration
  | QuasarElectronBuilderConfiguration;
