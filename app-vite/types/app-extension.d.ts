import type { UserConfig as ViteUserConfig } from "vite";
import type { GenerateSWOptions, InjectManifestOptions } from "workbox-build";
import type { RolldownOptions } from "rolldown";

import type { QuasarAppPathsResolve } from "./app-paths.d.ts";
import type {
  QuasarConf,
  ResolvedQuasarConfValue
} from "./configuration/conf.d.ts";
import type { QuasarContext } from "./configuration/context.d.ts";
import type { PwaManifestOptions } from "./configuration/pwa-conf.d.ts";
import type { QuasarLogger } from "./logger.d.ts";

type ExtendViteConfHandler = (
  fn: (
    ...args: [
      ...Parameters<ResolvedQuasarConfValue<"build.extendViteConf">>,
      api: IndexAPI
    ]
  ) => ViteUserConfig | void | Promise<ViteUserConfig | void>
) => void;

type GetPersistentConfHandler = () => Record<string, unknown>;
type AssignPersistentConfHandler = (cfg: Record<string, unknown>) => void;

type CompatibleWithHandler = (
  packageName: string,
  semverCondition?: string
) => void;
type HasPackageHandler = (
  packageName: string,
  semverCondition?: string
) => boolean;
type HasExtensionHandler = (extId: string) => boolean;
type GetPackageVersionHandler = (packageName: string) => string | undefined;

interface BaseAPI {
  /**
   * Quasar ctx (context) object.
   * @type ctx {@link QuasarContext}
   */
  readonly ctx: QuasarContext;
  readonly extId: string;
  /**
   * Utility functions to resolve absolute paths to the app's various directories.
   * @type resolve {@link QuasarAppPathsResolve}
   */
  readonly resolve: QuasarAppPathsResolve;
  readonly appDir: string;
  /**
   * Logging helpers matching the Quasar CLI output style.
   * `log`, `warn` and `fatal` are auto-prefixed with the extension id.
   * @type logger {@link QuasarLogger}
   */
  readonly logger: QuasarLogger;

  /**
   * Does the host app have TypeScript support?
   */
  readonly hasTypescript: () => Promise<boolean>;
  readonly getStorePackageName: () => "pinia" | undefined;
  readonly getNodePackagerName: () => Promise<"npm" | "yarn" | "pnpm" | "bun">;
}

interface SharedIndexInstallAPI {
  /**
   * Get the extension's persistent configuration object.
   * @type getPersistentConf {@link GetPersistentConfHandler}
   */
  readonly getPersistentConf: GetPersistentConfHandler;
  /**
   * Set the extension's persistent configuration object.
   * @type setPersistentConf {@link AssignPersistentConfHandler}
   */
  readonly setPersistentConf: AssignPersistentConfHandler;
  /**
   * Merge the extension's persistent configuration object.
   * @type mergePersistentConf {@link AssignPersistentConfHandler}
   */
  readonly mergePersistentConf: AssignPersistentConfHandler;

  /**
   * Ensure compatibility with a specific package and optionally a semver condition.
   * @type compatibleWith {@link CompatibleWithHandler}
   */
  readonly compatibleWith: CompatibleWithHandler;

  /**
   * Check if the host app has a specific package installed,
   * and optionally if it satisfies a semver condition.
   * @type hasPackage {@link HasPackageHandler}
   */
  readonly hasPackage: HasPackageHandler;

  /**
   * Check if the host app has a specific extension installed.
   * @type hasExtension {@link HasExtensionHandler}
   */
  readonly hasExtension: HasExtensionHandler;
  /**
   * Get the version of a package installed in the host app.
   * @type getPackageVersion {@link GetPackageVersionHandler}
   */
  readonly getPackageVersion: GetPackageVersionHandler;
}

type Callback<T> = (callback: T) => void;

export type PromptsScriptAnswers<Key extends string = string> = Record<
  Key,
  any
>;

export interface IndexAPI extends BaseAPI, SharedIndexInstallAPI {
  /**
   * Answers received from the Prompts Script (if any).
   * @type prompts {@link PromptsScriptAnswers}
   */
  readonly prompts: PromptsScriptAnswers;

  /**
   * Extend the Quasar configuration object that is used by the CLI.
   *
   * @param cfg {@link QuasarConf}
   * @param api {@link IndexAPI}
   */
  readonly extendQuasarConf: Callback<
    (
      cfg: QuasarConf,
      api: IndexAPI
    ) => QuasarConf | void | Promise<QuasarConf | void>
  >;

  /**
   * Similar in use to /quasar.config > build > extendViteConf
   * @type extendViteConf {@link ExtendViteConfHandler}
   */
  readonly extendViteConf: ExtendViteConfHandler;

  /**
   * Extend the Rolldown config that is used for the bex scripts
   * (background, content scripts, dom script).
   *
   * Can be async. Can directly modify the "config" parameter or
   * return a new one that will be merged with the default one.
   *
   * Similar in use to /quasar.config > bex > extendBexScriptsConf
   *
   * @param cfg {@link RolldownOptions}
   * @param api {@link IndexAPI}
   */
  readonly extendBexScriptsConf: Callback<
    (
      cfg: RolldownOptions,
      api: IndexAPI
    ) => void | RolldownOptions | Promise<void | RolldownOptions>
  >;

  /**
   * Should you need some dynamic changes to the Browser Extension manifest file
   * (/src-bex/manifest.json) then use this method to do it.
   *
   * Can be async. Can directly modify the "json" parameter or
   * return a new one that will be merged with the default one.
   *
   * Similar in use to /quasar.config > bex > extendBexManifestJson
   *
   * @param json The content of /src-bex/manifest.json as a JavaScript object
   * @param api {@link IndexAPI}
   */
  readonly extendBexManifestJson: (
    json: Record<string, any>,
    api: IndexAPI
  ) => void | Record<string, any> | Promise<void | Record<string, any>>;

  /**
   * Extend the Rolldown config that is used for the electron-main thread.
   *
   * Can be async. Can directly modify the "config" parameter or
   * return a new one that will be merged with the default one.
   *
   * Similar in use to /quasar.config > electron > extendElectronMainConf
   *
   * @param cfg {@link RolldownOptions}
   * @param api {@link IndexAPI}
   */
  readonly extendElectronMainConf: Callback<
    (
      cfg: RolldownOptions,
      api: IndexAPI
    ) => void | RolldownOptions | Promise<void | RolldownOptions>
  >;

  /**
   * Extend the Rolldown config that is used for the electron-preload thread.
   *
   * Can be async. Can directly modify the "config" parameter or
   * return a new one that will be merged with the default one.
   *
   * Similar in use to /quasar.config > electron > extendElectronPreloadConf
   *
   * @param cfg {@link RolldownOptions}
   * @param api {@link IndexAPI}
   */
  readonly extendElectronPreloadConf: Callback<
    (
      cfg: RolldownOptions,
      api: IndexAPI
    ) => void | RolldownOptions | Promise<void | RolldownOptions>
  >;

  /**
   * Add/remove/change properties of Electron production generated package.json
   *
   * Can be async. Can directly modify the "pkgJson" parameter or
   * return a new one that will be merged with the default one.
   *
   * Similar in use to /quasar.config > electron > extendElectronPackageJson
   *
   * @param pkgJson The content of the generated package.json for Electron production build
   * @param api {@link IndexAPI}
   */
  readonly extendElectronPackageJson: (
    pkgJson: { [index in string]: any },
    api: IndexAPI
  ) =>
    | void
    | { [index in string]: any }
    | Promise<void | { [index in string]: any }>;

  /**
   * Should you need some dynamic changes to the /src-pwa/manifest.json,
   * use this method to do it.
   *
   * Can be async. Can directly modify the "json" parameter or
   * return a new one that will be merged with the default one.
   *
   * Similar in use to /quasar.config > pwa > extendPWAManifestJson
   *
   * @param json {@link PwaManifestOptions}
   * @param api {@link IndexAPI}
   */
  readonly extendPWAManifestJson: (
    json: PwaManifestOptions,
    api: IndexAPI
  ) => void | PwaManifestOptions | Promise<void | PwaManifestOptions>;

  /**
   * Extend the Rolldown config that is used for the custom service worker
   * (if using it through workboxMode: 'InjectManifest').
   *
   * Can be async. Can directly modify the "config" parameter or
   * return a new one that will be merged with the default one.
   *
   * Similar in use to /quasar.config > pwa > extendPWACustomSWConf
   *
   * @param cfg {@link RolldownOptions}
   * @param api {@link IndexAPI}
   */
  readonly extendPWACustomSWConf: Callback<
    (
      cfg: RolldownOptions,
      api: IndexAPI
    ) => void | RolldownOptions | Promise<void | RolldownOptions>
  >;

  /**
   * Extend/configure the Workbox GenerateSW options.
   *
   * Can be async. Can directly modify the "config" parameter or
   * return a new one that will be merged with the default one.
   *
   * Similar in use to /quasar.config > pwa > extendPWAGenerateSWOptions
   *
   * @param config {@link GenerateSWOptions}
   * @param api {@link IndexAPI}
   */
  readonly extendPWAGenerateSWOptions: (
    config: GenerateSWOptions,
    api: IndexAPI
  ) => void | GenerateSWOptions | Promise<void | GenerateSWOptions>;

  /**
   * Extend/configure the Workbox InjectManifest options.
   *
   * Can be async. Can directly modify the "config" parameter or
   * return a new one that will be merged with the default one.
   *
   * Similar in use to /quasar.config > pwa > extendPWAInjectManifestOptions
   *
   * @param config {@link InjectManifestOptions}
   * @param api {@link IndexAPI}
   */
  readonly extendPWAInjectManifestOptions: (
    config: InjectManifestOptions,
    api: IndexAPI
  ) => void | InjectManifestOptions | Promise<void | InjectManifestOptions>;

  /**
   * Extend the Rolldown config that is used for the SSR webserver
   * (which includes the SSR middlewares).
   *
   * Can be async. Can directly modify the "rolldownConf" parameter or
   * return a new one that will be merged with the default one.
   *
   * Similar in use to /quasar.config > ssr > extendSSRWebserverConf
   *
   * @param cfg {@link RolldownOptions}
   * @param api {@link IndexAPI}
   */
  readonly extendSSRWebserverConf: Callback<
    (
      cfg: RolldownOptions,
      api: IndexAPI
    ) => void | RolldownOptions | Promise<void | RolldownOptions>
  >;

  /**
   * Add/remove/change properties of SSR production generated package.json
   *
   * Can be async. Can directly modify the "pkgJson" parameter or
   * return a new one that will be merged with the default one.
   *
   * Similar in use to /quasar.config > ssr > extendSSRPackageJson
   *
   * @param pkgJson The content of the generated package.json for SSR production build
   * @param api {@link IndexAPI}
   */
  readonly extendSSRPackageJson: (
    pkgJson: { [index in string]: any },
    api: IndexAPI
  ) =>
    | void
    | { [index in string]: any }
    | Promise<void | { [index in string]: any }>;

  /**
   * Extend/configure the Workbox GenerateSW options
   * Specify Workbox options which will be applied on top of
   *  `pwa > extendPWAGenerateSWOptions()`.
   *
   * https://developer.chrome.com/docs/workbox/the-ways-of-workbox/
   *
   * Can be async. Can directly modify the "config" parameter or
   * return a new one that will be merged with the default one.
   *
   * Similar in use to /quasar.config > ssr > extendSSRGenerateSWOptions
   *
   * @param config {@link GenerateSWOptions}
   * @param api {@link IndexAPI}
   */
  readonly extendSSRGenerateSWOptions: (
    config: GenerateSWOptions,
    api: IndexAPI
  ) => void | GenerateSWOptions | Promise<void | GenerateSWOptions>;

  /**
   * Extend/configure the Workbox InjectManifest options
   * Specify Workbox options which will be applied on top of
   *  `pwa > extendPWAInjectManifestOptions()`.
   *
   * https://developer.chrome.com/docs/workbox/the-ways-of-workbox/
   *
   * Can be async. Can directly modify the "config" parameter or
   * return a new one that will be merged with the default one.
   *
   * Similar in use to /quasar.config > ssr > extendSSRInjectManifestOptions
   *
   * @param config {@link InjectManifestOptions}
   * @param api {@link IndexAPI}
   */
  readonly extendSSRInjectManifestOptions: (
    config: InjectManifestOptions,
    api: IndexAPI
  ) => void | InjectManifestOptions | Promise<void | InjectManifestOptions>;

  /**
   * Extend the Rolldown config that is used for the SSG renderer
   * (which is your /src-ssg/ssg-renderer file).
   *
   * Can be async. Can directly modify the "rolldownConf" parameter or
   * return a new one that will be merged with the default one.
   *
   * Similar in use to /quasar.config > ssg > extendSSGRendererConf
   *
   * @param cfg {@link RolldownOptions}
   * @param api {@link IndexAPI}
   */
  readonly extendSSGRendererConf: Callback<
    (
      cfg: RolldownOptions,
      api: IndexAPI
    ) => void | RolldownOptions | Promise<void | RolldownOptions>
  >;

  /**
   * Extend/configure the Workbox GenerateSW options
   * Specify Workbox options which will be applied on top of
   *  `pwa > extendPWAGenerateSWOptions()`.
   *
   * https://developer.chrome.com/docs/workbox/the-ways-of-workbox/
   *
   * Can be async. Can directly modify the "config" parameter or
   * return a new one that will be merged with the default one.
   *
   * Similar in use to /quasar.config > ssg > extendSSGGenerateSWOptions
   *
   * @param config {@link GenerateSWOptions}
   * @param api {@link IndexAPI}
   */
  readonly extendSSGGenerateSWOptions: (
    config: GenerateSWOptions,
    api: IndexAPI
  ) => void | GenerateSWOptions | Promise<void | GenerateSWOptions>;

  /**
   * Extend/configure the Workbox InjectManifest options
   * Specify Workbox options which will be applied on top of
   *  `pwa > extendPWAInjectManifestOptions()`.
   *
   * https://developer.chrome.com/docs/workbox/the-ways-of-workbox/
   *
   * Can be async. Can directly modify the "config" parameter or
   * return a new one that will be merged with the default one.
   *
   * Similar in use to /quasar.config > ssg > extendSSGInjectManifestOptions
   *
   * @param config {@link InjectManifestOptions}
   * @param api {@link IndexAPI}
   */
  readonly extendSSGInjectManifestOptions: (
    config: InjectManifestOptions,
    api: IndexAPI
  ) => void | InjectManifestOptions | Promise<void | InjectManifestOptions>;

  /**
   * Register a custom CLI command
   *
   * @param commandName The name of the command
   * @param fn The function to execute when the command is called
   */
  readonly registerCommand: (
    commandName: string,
    fn: (processArgv: string[]) => Promise<void> | void
  ) => void;

  /**
   * Register a component/directive/plugin Json API.
   *
   * @param name The name of the component/directive/plugin
   * @param relativePath The relative path to the API file
   */
  readonly registerDescribeApi: (name: string, relativePath: string) => void;

  /**
   * Register a callback to be called before the "quasar dev" command.
   *
   * @param api {@link IndexAPI}
   * @param payload The payload containing the Quasar configuration object
   */
  readonly beforeDev: Callback<
    (api: IndexAPI, payload: { quasarConf: QuasarConf }) => Promise<void> | void
  >;
  /**
   * Register a callback to be called after the "quasar dev" command.
   *
   * @param api {@link IndexAPI}
   * @param payload The payload containing the Quasar configuration object
   */
  readonly afterDev: Callback<
    (api: IndexAPI, payload: { quasarConf: QuasarConf }) => Promise<void> | void
  >;
  /**
   * Run hook before Quasar builds app for production ("quasar build").
   * At this point, the distributables folder hasn't been created yet.
   *
   * @param {function} fn
   *   (api, { quasarConf }) => ?Promise
   */
  readonly beforeBuild: Callback<
    (api: IndexAPI, payload: { quasarConf: QuasarConf }) => Promise<void> | void
  >;
  /**
   * Register a callback to be called after the "quasar build" command.
   *
   * @param api {@link IndexAPI}
   * @param payload The payload containing the Quasar configuration object
   */
  readonly afterBuild: Callback<
    (api: IndexAPI, payload: { quasarConf: QuasarConf }) => Promise<void> | void
  >;
  /**
   * Run hook if publishing was requested ("quasar build -P"),
   * after Quasar built app for production and the afterBuild
   * hook (if specified) was executed.
   *
   * @param {function} fn
   *   ({ arg, ...}) => ?Promise
   *      * arg - argument supplied to "--publish"/"-P" parameter
   *      * quasarConf - quasar.config file config object
   *      * distDir - folder where distributables were built
   */
  readonly onPublish: Callback<
    (
      api: IndexAPI,
      opts: { arg: string; distDir: string }
    ) => Promise<void> | void
  >;
}

export type IndexAPICallback = (api: IndexAPI) => void | Promise<void>;

type ExitLogHandler = (msg: string) => void;
export interface InstallAPI extends BaseAPI, SharedIndexInstallAPI {
  /**
   * Answers received from the Prompts Script (if any).
   * @type prompts {@link PromptsScriptAnswers}
   */
  readonly prompts: PromptsScriptAnswers;

  /**
   * Extend package.json with new props.
   * If specifying existing props, it will override them.
   *
   * @param {object|string} extPkg - Object to extend with or relative path to a JSON file
   */
  readonly extendPackageJson: (extPkg: object | string) => void;
  /**
   * Extend a JSON file with new props (deep merge).
   * If specifying existing props, it will override them.
   *
   * @param {string} file (relative path to app root folder)
   * @param {object} newData (Object to merge in)
   */
  readonly extendJsonFile: (file: string, newData: object) => void;

  /**
   * Render a folder from extension templates into devland.
   * Needs a path (to a folder) relative to the path of the file where render() is called
   *
   * @param {string} templatePath (relative path to folder to render in app)
   * @param {object} scope (optional; rendering scope variables)
   */
  readonly render: (templatePath: string, scope?: object) => void;
  /**
   * Render a file from extension template into devland
   * Needs a path (to a file) relative to the path of the file where renderFile() is called
   *
   * @param {string} relativeSourcePath (file path relative to the folder from which the install script is called)
   * @param {string} relativeTargetPath (file path relative to the root of the app -- including filename!)
   * @param {object} scope (optional; rendering scope variables)
   */
  readonly renderFile: (
    relativeSourcePath: string,
    relativeTargetPath: string,
    scope?: object
  ) => void;

  /**
   * Add a message to be printed after App CLI finishes up install.
   *
   * @type onExitLog {@link ExitLogHandler}
   * @param {string} msg
   */
  readonly onExitLog: ExitLogHandler;
}

export type InstallAPICallback = (api: InstallAPI) => void | Promise<void>;

export interface UninstallAPI extends BaseAPI {
  /**
   * Answers received from the Prompts Script (if any).
   * @type prompts {@link PromptsScriptAnswers}
   */
  readonly prompts: PromptsScriptAnswers;

  /**
   * Get the extension's persistent configuration object.
   * @type getPersistentConf {@link GetPersistentConfHandler}
   */
  readonly getPersistentConf: GetPersistentConfHandler;

  /**
   * Check if the host app has a specific extension installed.
   * @type hasExtension {@link HasExtensionHandler}
   */
  readonly hasExtension: HasExtensionHandler;

  /**
   * Remove a file or folder from devland which the
   * extension has installed and is no longer needed.
   *
   * Be careful about it and do not delete the files
   * that would break developer's app.
   *
   * The __path (file or folder) needs to be relative
   * to project's root folder.
   *
   * @param {string} __path
   */
  readonly removePath: (__path: string) => void;

  /**
   * Add a message to be printed after App CLI finishes up install.
   *
   * @type onExitLog {@link ExitLogHandler}
   * @param {string} msg
   */
  readonly onExitLog: ExitLogHandler;
}

export type UninstallAPICallback = (api: UninstallAPI) => void | Promise<void>;

export interface PromptsAPI extends BaseAPI {
  /**
   * Ensure compatibility with a specific package and optionally a semver condition.
   * @type compatibleWith {@link CompatibleWithHandler}
   */
  readonly compatibleWith: CompatibleWithHandler;

  /**
   * Check if the host app has a specific package installed,
   * and optionally if it satisfies a semver condition.
   * @type hasPackage {@link HasPackageHandler}
   */
  readonly hasPackage: HasPackageHandler;

  /**
   * Check if the host app has a specific extension installed.
   * @type hasExtension {@link HasExtensionHandler}
   */
  readonly hasExtension: HasExtensionHandler;
  /**
   * Get the version of a package installed in the host app.
   * @type getPackageVersion {@link GetPackageVersionHandler}
   */
  readonly getPackageVersion: GetPackageVersionHandler;
}

export type PromptsAPICallback = (
  api: PromptsAPI
) =>
  | PromptsScriptAnswers
  | Promise<PromptsScriptAnswers>
  | void
  | Promise<void>;
