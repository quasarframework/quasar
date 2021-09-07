import {
  ElectronBuilderUtilProxy,
  ElectronBuilderProxy,
  ElectronPackagerProxy,
} from "../ts-proxies";
import { Configuration as WebpackConfiguration } from "webpack";
import * as WebpackChain from "webpack-chain";
import { LiteralUnion } from "../ts-helpers";

export type QuasarElectronBundlersInternal = "builder" | "packager";

type ElectronBuilderConfiguration = ElectronBuilderProxy.Configuration;
type ElectronPackagerOptions = ElectronPackagerProxy.Options;

interface QuasarBaseElectronConfiguration {
  /**
   * Add/remove/change properties of production generated package.json
   */
  extendPackageJson?: (pkg: { [index in string]: any }) => void;

  /** Webpack config object for the Main Process ONLY (`/src-electron/electron-main`) */
  extendWebpackMain?: (config: WebpackConfiguration) => void;
  /**
   * Equivalent to `extendWebpackMain()` but uses `webpack-chain` instead,
   *  for the Main Process ONLY (`/src-electron/electron-main`)
   */
  chainWebpackMain?: (chain: WebpackChain) => void;

  /** Webpack config object for the Preload Process ONLY (`/src-electron/electron-preload`) */
  extendWebpackPreload?: (config: WebpackConfiguration) => void;
  /**
   * Equivalent to `extendWebpackPreload()` but uses `webpack-chain` instead,
   *  for the Preload Process ONLY (`/src-electron/electron-preload`)
   */
  chainWebpackPreload?: (chain: WebpackChain) => void;

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
  bundler: QuasarElectronBundlersInternal;

  /**
   * Specify additional parameters when yarn/npm installing
   * the UnPackaged folder, right before bundling with either
   * electron packager or electron builder;
   * Example: [ '--ignore-optional', '--some-other-param' ]
   */
  unPackagedInstallParams?: string[];
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

export type ElectronBuilderArchs = ElectronBuilderUtilProxy.ArchType;
// ElectronBuilder doesn't export exact types for the target option
export type ElectronBuilderTargets = string;

export type ElectronPackagerArchs = LiteralUnion<
  ElectronPackagerProxy.OfficialArch | "all"
>;
export type ElectronPackagerTargets = LiteralUnion<
  ElectronPackagerProxy.OfficialPlatform | "all"
>;

export type QuasarElectronConfiguration =
  | QuasarElectronPackagerConfiguration
  | QuasarElectronBuilderConfiguration;
