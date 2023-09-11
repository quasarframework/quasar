import { IResolve } from "./app-paths";
import { QuasarConf } from "./configuration/conf";
import { QuasarContext } from "./configuration/context";
import { DeepRequired, DeepNonNullable } from "ts-essentials";

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
  engine: '@quasar/app-vite';

  extId: string;
  resolve: IResolve;
  appDir: string;

  hasVite: true;
  hasWebpack: false;

  hasTypescript: () => boolean;
  hasLint: () => boolean;
  getStorePackageName: () => 'pinia' | 'vuex' | undefined;
  getNodePackagerName: () => 'npm' | 'yarn' | 'pnpm';
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

export interface IndexAPI extends SharedIndexInstallAPI, BaseAPI {
  ctx: QuasarContext;
  prompts: Record<string, unknown>;

  extendQuasarConf: (cfg: QuasarConf, api: IndexAPI) => void;
  chainWebpack: chainWebpack;
  extendWebpack: extendWebpack;
  chainWebpackMainElectronProcess: chainWebpack;
  extendWebpackMainElectronProcess: extendWebpack;
  chainWebpackPreloadElectronProcess: chainWebpack;
  extendWebpackPreloadElectronProcess: extendWebpack;
  chainWebpackWebserver: chainWebpack;
  extendWebpackWebserver: extendWebpack;
  chainWebpackCustomSW: chainWebpack;
  extendWebpackCustomSW: extendWebpack;
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
export interface InstallAPI extends SharedIndexInstallAPI, BaseAPI {
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
