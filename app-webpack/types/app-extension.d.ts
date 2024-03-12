import { IResolve } from "./app-paths";
import { QuasarConf } from "./configuration/conf";
import { QuasarContext } from "./configuration/context";
import { DeepRequired, DeepNonNullable } from "ts-essentials";
import { BuildOptions as EsbuildConfiguration } from "esbuild";

type QuasarConfProxy = DeepRequired<DeepNonNullable<QuasarConf>>;
type ExtractQuasarConfParameters<
  FirstLevelKey extends keyof QuasarConfProxy,
  SecondLevelKey extends keyof QuasarConfProxy[FirstLevelKey],
  MaybeFunction = QuasarConfProxy[FirstLevelKey][SecondLevelKey]
> = MaybeFunction extends (...args: any) => any
  ? Parameters<MaybeFunction>
  : never;

type chainWebpack = (
  fn: (
    ...args: [...ExtractQuasarConfParameters<"build", "chainWebpack">, IndexAPI]
  ) => void
) => void;
type extendWebpack = (
  fn: (
    ...args: [
      ...ExtractQuasarConfParameters<"build", "extendWebpack">,
      IndexAPI
    ]
  ) => void
) => void;

type getPersistentConf = () => Record<string, unknown>;
type hasExtension = (extId: string) => boolean;

interface BaseAPI {
  engine: '@quasar/app-webpack';

  ctx: QuasarContext;
  extId: string;
  resolve: IResolve;
  appDir: string;

  hasVite: false;
  hasWebpack: true;

  hasTypescript: () => Promise<boolean>;
  hasLint: () => Promise<boolean>;
  getStorePackageName: () => 'pinia' | 'vuex' | undefined;
  getNodePackagerName: () => Promise<'npm' | 'yarn' | 'pnpm' | 'bun'>;
}

interface SharedIndexInstallAPI {
  getPersistentConf: getPersistentConf;
  setPersistentConf: (cfg: Record<string, unknown>) => void;
  mergePersistentConf: (cfg: Record<string, unknown>) => void;
  compatibleWith: (packageName: string, semverCondition?: string) => void;
  hasPackage: (packageName: string, semverCondition?: string) => boolean;
  hasExtension: hasExtension;
  getPackageVersion: (packageName: string) => string | undefined;
}

export interface IndexAPI extends BaseAPI, SharedIndexInstallAPI {
  prompts: Record<string, unknown>;

  extendQuasarConf: (cfg: QuasarConf, api: IndexAPI) => void;

  chainWebpack: chainWebpack;
  extendWebpack: extendWebpack;

  extendBexScriptsConf: (cfg: EsbuildConfiguration, api: IndexAPI) => void;
  extendElectronMainConf: (cfg: EsbuildConfiguration, api: IndexAPI) => void;
  extendElectronPreloadConf: (cfg: EsbuildConfiguration, api: IndexAPI) => void;
  extendPWACustomSWConf: (cfg: EsbuildConfiguration, api: IndexAPI) => void;
  extendSSRWebserverConf: (cfg: EsbuildConfiguration, api: IndexAPI) => void;

  registerCommand: (
    commandName: string,
    fn: { args: string[]; params: Record<string, any> }
  ) => void;

  registerDescribeApi: (name: string, relativePath: string) => void;

  beforeDev: (
    api: IndexAPI,
    payload: { quasarConf: QuasarConf }
  ) => Promise<void> | void;
  afterDev: (
    api: IndexAPI,
    payload: { quasarConf: QuasarConf }
  ) => Promise<void> | void;
  beforeBuild: (
    api: IndexAPI,
    payload: { quasarConf: QuasarConf }
  ) => Promise<void> | void;
  afterBuild: (
    api: IndexAPI,
    payload: { quasarConf: QuasarConf }
  ) => Promise<void> | void;
  onPublish: (
    api: IndexAPI,
    opts: { arg: string; distDir: string }
  ) => Promise<void> | void;
}

type onExitLog = (msg: string) => void;
export interface InstallAPI extends BaseAPI, SharedIndexInstallAPI {
  prompts: Record<string, unknown>;

  extendPackageJson: (extPkg: object | string) => void;
  extendJsonFile: (file: string, newData: object) => void;
  render: (templatePath: string, scope?: object) => void;
  renderFile: (
    relativeSourcePath: string,
    relativeTargetPath: string,
    scope?: object
  ) => void;
  onExitLog: onExitLog;
}

export interface UninstallAPI extends BaseAPI {
  prompts: Record<string, unknown>;

  getPersistentConf: getPersistentConf;
  hasExtension: hasExtension;
  removePath: (__path: string) => void;
  onExitLog: onExitLog;
}

export interface PromptsAPI extends BaseAPI {
  compatibleWith: (packageName: string, semverCondition?: string) => void;
  hasPackage: (packageName: string, semverCondition?: string) => boolean;
  hasExtension: hasExtension;
  getPackageVersion: (packageName: string) => string | undefined;
}
