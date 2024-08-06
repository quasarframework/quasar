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

type ExtendViteConfHandler = (
  fn: (
    ...args: [...ExtractQuasarConfParameters<"build", "extendViteConf">, IndexAPI]
  ) => void
) => void;

type GetPersistentConfHandler = () => Record<string, unknown>;
type HasExtensionHandler = (extId: string) => boolean;

interface BaseAPI {
  engine: '@quasar/app-vite';

  ctx: QuasarContext;
  extId: string;
  resolve: IResolve;
  appDir: string;

  hasVite: true;
  hasWebpack: false;

  hasTypescript: () => Promise<boolean>;
  hasLint: () => Promise<boolean>;
  getStorePackageName: () => 'pinia' | 'vuex' | undefined;
  getNodePackagerName: () => Promise<'npm' | 'yarn' | 'pnpm' | 'bun'>;
}

interface SharedIndexInstallAPI {
  getPersistentConf: GetPersistentConfHandler;
  setPersistentConf: (cfg: Record<string, unknown>) => void;
  mergePersistentConf: (cfg: Record<string, unknown>) => void;
  compatibleWith: (packageName: string, semverCondition?: string) => void;
  hasPackage: (packageName: string, semverCondition?: string) => boolean;
  hasExtension: HasExtensionHandler;
  getPackageVersion: (packageName: string) => string | undefined;
}

type Callback<T> = (callback: T) => void;

export interface IndexAPI extends BaseAPI, SharedIndexInstallAPI {
  prompts: Record<string, unknown>;

  extendQuasarConf: Callback<(cfg: QuasarConf, api: IndexAPI) => void>;

  extendViteConf: ExtendViteConfHandler;

  extendBexScriptsConf: Callback<(cfg: EsbuildConfiguration, api: IndexAPI) => void>;
  extendElectronMainConf: Callback<(cfg: EsbuildConfiguration, api: IndexAPI) => void>;
  extendElectronPreloadConf: Callback<(cfg: EsbuildConfiguration, api: IndexAPI) => void>;
  extendPWACustomSWConf: Callback<(cfg: EsbuildConfiguration, api: IndexAPI) => void>;
  extendSSRWebserverConf: Callback<(cfg: EsbuildConfiguration, api: IndexAPI) => void>;

  registerCommand: (
    commandName: string,
    fn: (params: { args: string[]; params: Record<string, any> }) => Promise<void> | void
  ) => void;

  registerDescribeApi: (name: string, relativePath: string) => void;

  beforeDev: Callback<(
    api: IndexAPI,
    payload: { quasarConf: QuasarConf }
  ) => Promise<void> | void>;
  afterDev: Callback<(
    api: IndexAPI,
    payload: { quasarConf: QuasarConf }
  ) => Promise<void> | void>;
  beforeBuild: Callback<(
    api: IndexAPI,
    payload: { quasarConf: QuasarConf }
  ) => Promise<void> | void>;
  afterBuild: Callback<(
    api: IndexAPI,
    payload: { quasarConf: QuasarConf }
  ) => Promise<void> | void>;
  onPublish: Callback<(
    api: IndexAPI,
    opts: { arg: string; distDir: string }
  ) => Promise<void> | void>;
}

type ExitLogHandler = (msg: string) => void;
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
  onExitLog: ExitLogHandler;
}

export interface UninstallAPI extends BaseAPI {
  prompts: Record<string, unknown>;

  getPersistentConf: GetPersistentConfHandler;
  hasExtension: HasExtensionHandler;
  removePath: (__path: string) => void;
  onExitLog: ExitLogHandler;
}

export interface PromptsAPI extends BaseAPI {
  compatibleWith: (packageName: string, semverCondition?: string) => void;
  hasPackage: (packageName: string, semverCondition?: string) => boolean;
  hasExtension: HasExtensionHandler;
  getPackageVersion: (packageName: string) => string | undefined;
}
