import * as ElectronBuilderUtil from "builder-util";
import * as ElectronBuilder from "electron-builder";
import * as ElectronPackager from "@electron/packager";
import { LiteralUnion } from "quasar";
import { BuildOptions as EsbuildConfiguration } from "esbuild";

export type QuasarElectronBundlersInternal = "builder" | "packager";

type ElectronBuilderConfiguration = ElectronBuilder.Configuration;
type ElectronPackagerOptions = ElectronPackager.Options;

interface QuasarBaseElectronConfiguration {
  /**
   * Add/remove/change properties of production generated package.json
   */
  extendPackageJson?: (pkg: { [index in string]: any }) => void;

  /**
   * Extend the esbuild config that is used for the electron-main thread
   */
  extendElectronMainConf?: (config: EsbuildConfiguration) => void;

  /**
   * Extend the esbuild config that is used for the electron-preload thread
   */
  extendElectronPreloadConf?: (config: EsbuildConfiguration) => void;

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
   * Example: [ 'install', '--production', '--ignore-optional', '--some-other-param' ]
   */
  unPackagedInstallParams?: string[];

  /**
   * Specify the debugging port to use for the Electron app when running in development mode
   * @default 5858
   */
  inspectPort?: number;
}

interface QuasarElectronPackagerConfiguration
  extends QuasarBaseElectronConfiguration {
  bundler: "packager";

  /**
   * @electron/packager options.
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

export type ElectronBuilderArchs = ElectronBuilderUtil.Arch;
// ElectronBuilder doesn't export exact types for the target option
export type ElectronBuilderTargets = string;

export type ElectronPackagerArchs = LiteralUnion<
  ElectronPackager.OfficialArch | "all"
>;
export type ElectronPackagerTargets = LiteralUnion<
  ElectronPackager.OfficialPlatform | "all"
>;

export type QuasarElectronConfiguration =
  | QuasarElectronPackagerConfiguration
  | QuasarElectronBuilderConfiguration;
