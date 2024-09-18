import { Plugin, UserConfig as ViteUserConfig } from "vite";
import { Options as VuePluginOptions } from "@vitejs/plugin-vue"
import { QuasarHookParams } from "./conf";
import { CompilerOptions, TypeAcquisition } from "typescript";

interface HtmlMinifierOptions {
  caseSensitive?: boolean;
  collapseBooleanAttributes?: boolean;
  collapseInlineTagWhitespace?: boolean;
  collapseWhitespace?: boolean;
  conservativeCollapse?: boolean;
  continueOnParseError?: boolean;
  customAttrAssign?: RegExp[];
  customAttrCollapse?: RegExp;
  customAttrSurround?: RegExp[];
  customEventAttributes?: RegExp[];
  decodeEntities?: boolean;
  html5?: boolean;
  ignoreCustomComments?: RegExp[];
  ignoreCustomFragments?: RegExp[];
  includeAutoGeneratedTags?: boolean;
  keepClosingSlash?: boolean;
  maxLineLength?: number;
  minifyCSS?: boolean;
  minifyJS?: boolean;
  minifyURLs?: boolean;
  preserveLineBreaks?: boolean;
  preventAttributesEscaping?: boolean;
  processConditionalComments?: boolean;
  processScripts?: string[];
  quoteCharacter?: string;
  removeAttributeQuotes?: boolean;
  removeComments?: boolean;
  removeEmptyAttributes?: boolean;
  removeEmptyElements?: boolean;
  removeOptionalTags?: boolean;
  removeRedundantAttributes?: boolean;
  removeScriptTypeAttributes?: boolean;
  removeStyleLinkTypeAttributes?: boolean;
  removeTagWhitespace?: boolean;
  sortAttributes?: boolean;
  sortClassName?: boolean;
  trimCustomFragments?: boolean;
  useShortDoctype?: boolean;
}

// TSConfig type is adapted from https://github.com/unjs/pkg-types/blob/0bec64641468c9560dea95da2cff502ea8118286/src/types/tsconfig.ts
type StripEnums<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends boolean
    ? T[K]
    : T[K] extends string
      ? T[K]
      : T[K] extends object
        ? T[K]
        : T[K] extends Array<any>
          ? T[K]
          : T[K] extends undefined
            ? undefined
            : any;
};
interface TSConfig {
  compilerOptions?: StripEnums<CompilerOptions>;
  exclude?: string[];
  compileOnSave?: boolean;
  extends?: string | string[];
  files?: string[];
  include?: string[];
  typeAcquisition?: TypeAcquisition;
}

interface InvokeParams {
  isClient: boolean;
  isServer: boolean;
}

interface BuildTargetOptions {
  /**
   * @default ['es2022', 'firefox115', 'chrome115', 'safari14']
   */
  browser?: string[];
  /**
   * @example 'node20'
   */
  node?: string;
}

interface PluginEntryRunOptions {
  server?: boolean;
  client?: boolean;
}

type PluginEntry =
  | [pluginName: string, options?: any, runOptions?: PluginEntryRunOptions]
  | [pluginFactory: (options?: any) => Plugin, options?: any, runOptions?: PluginEntryRunOptions]
  | Plugin
  | null
  | undefined
  | false;

interface QuasarStaticBuildConfiguration {
  /**
   * @example
   * {
   *   browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
   *   node: 'node20'
   * }
   */
  target?: BuildTargetOptions;
  /**
   * Extend Vite config generated by Quasar CLI.
   */
  extendViteConf?: (
    config: ViteUserConfig,
    invokeParams: InvokeParams
  ) => void;
  /**
   * Options to supply to @vitejs/plugin-vue
   *
   * @see https://v2.quasar.dev/quasar-cli-vite/handling-vite#vite-vue-plugin-options
   */
  viteVuePluginOptions?: VuePluginOptions;
  /**
   * Vite plugins
   *
   * @see https://v2.quasar.dev/quasar-cli-vite/handling-vite#adding-vite-plugins
   *
   * @example
   * // ESM
   * import { somePlugin } from 'some-plugin'
   * // ...
   * [
   *   [ 'some-plugin', { ...pluginOptions... } ],
   *
   *   // disable running on client or server threads (set server/client to false):
   *   [ 'some-plugin', { ...pluginOptions... }, { server: true, client: true } ],
   *
   *   [ somePlugin, { ...pluginOptions... } ],
   *
   *   // disable running on client or server threads (set server/client to false):
   *   [ somePlugin, { ...pluginOptions... }, { server: true, client: true } ],
   *
   *   somePlugin({ ...pluginOptions... })
   * ]
   *
   * @example
   * // CJS
   * [
   *   [ 'some-plugin', { ...pluginOptions... } ],
   *
   *   // disable running on client or server threads (set server/client to false):
   *   [ 'some-plugin', { ...pluginOptions... }, { server: true, client: true } ],
   *
   *   [ require('some-plugin'), { ...pluginOptions... } ],
   *
   *   // disable running on client or server threads (set server/client to false):
   *   [ require('some-plugin'), { ...pluginOptions... }, { server: true, client: true } ],
   *
   *   require('some-plugin')({ ...pluginOptions... })
   * ]
   */
  vitePlugins?: PluginEntry[];
  /**
   * @see https://v2.quasar.dev/quasar-cli-vite/handling-vite#folder-aliases
   *
   * @example
   * {
   *   // import { ... } from 'locales/...'
   *   locales: path.join(__dirname, 'src/locales')
   * }
   */
  alias?: { [key: string]: string };
  /**
   * Configuration for TypeScript integration.
   */
  typescript?: {
    /**
     * Extend the generated `.quasar/tsconfig.json` file.
     *
     * If you don't have dynamic logic, you can directly modify your `tsconfig.json` file instead.
     */
    extendTsConfig?: (tsConfig: TSConfig) => void;
  };
  /**
   * Public path of your app.
   * Use it when your public path is something else,
   * like _“<protocol>://<domain>/some/nested/folder”_ – in this case,
   * it means the distributables are in _“some/nested/folder”_ on your webserver.
   *
   * @default '/'
   */
  publicPath?: string;
  /**
   * Sets [Vue Router mode](https://router.vuejs.org/guide/essentials/history-mode.html).
   * History mode requires configuration on your deployment web server too.
   *
   * @default 'hash'
   */
  vueRouterMode?: "hash" | "history";
  /**
   * Sets Vue Router base.
   * Should not need to configure this, unless absolutely needed.
   */
  vueRouterBase?: string;
  /**
   * Automatically open remote Vue Devtools when running in development mode.
   */
  vueDevtools?: boolean;
  /**
   * Should the Vue Options API be available? If all your components only use Composition API
   * it would make sense performance-wise to disable Vue Options API for a compile speedup.
   *
   * @default true
   */
  vueOptionsAPI?: boolean;
  /**
   * Do you want to analyze the production bundles?
   * Generates and opens an HTML report.
   *
   * @default false
   */
  analyze?: boolean;
  /**
   * Folder where Quasar CLI should generate the distributables.
   * Relative path to project root directory.
   *
   * @default 'dist/{ctx.modeName}' For all modes except Cordova.
   * @default 'src-cordova/www' For Cordova mode.
   */
  distDir?: string;

  /**
   * Add properties to `process.env` that you can use in your website/app JS code.
   *
   * @see https://v2.quasar.dev/quasar-cli-vite/handling-process-env
   *
   * @example { SOMETHING: 'someValue' }
   */
  env?: { [index: string]: string | boolean | undefined | null };
  /**
   * Defines constants that get replaced in your app.
   * Unlike `env`, you will need to use JSON.stringify() on the values yourself except for booleans.
   * Also, these will not be prefixed with `process.env.`.
   *
   * @example { SOMETHING: JSON.stringify('someValue') } -> console.log(SOMETHING) // console.log('someValue')
   */
  rawDefine?: { [index: string]: string | boolean | undefined | null };
  /**
   * Folder where Quasar CLI should look for .env* files.
   * Can be an absolute path or a relative path to project root directory.
   *
   * @default project root directory
   */
  envFolder?: string;
  /**
   * Additional .env* files to be loaded.
   * Each entry can be an absolute path or a relative path to quasar.config > build > envFolder.
   *
   * @example ['.env.somefile', '../.env.someotherfile']
   */
  envFiles?: string[];

  /**
   * Build production assets with or without the hash part in filenames.
   * Example: "454d87bd" in "assets/index.454d87bd.js"
   *
   * When used, please be careful how you configure your web server cache strategy as
   * files will not change name so your client might get 304 (Not Modified) even when
   * it's not the case.
   *
   * Will not change anything if your Vite config already touches the
   * build.rollupOptions.output.entryFileNames/chunkFileNames/assetFileNames props.
   *
   * Gets applied to production builds only.
   *
   * Useful especially for (but not restricted to) PWA. If set to false then updating the
   * PWA will force to re-download all assets again, regardless if they were changed or
   * not (due to how Rollup works through Vite).
   *
   * @default true
   */
  useFilenameHashes?: boolean;

  /**
   * whether to inject module preload polyfill.
   * @default false
   */
  polyfillModulePreload?: boolean;
  /**
   * Ignores the public folder.
   * @default false
   */
  ignorePublicFolder?: boolean;

  /**
   * Prepare external services before `$ quasar dev` command runs
   * like starting some backend or any other service that the app relies on.
   * Can use async/await or directly return a Promise.
   */
  beforeDev?: (params: QuasarHookParams) => void;
  /**
   * Run hook after Quasar dev server is started (`$ quasar dev`).
   * At this point, the dev server has been started and is available should you wish to do something with it.
   * Can use async/await or directly return a Promise.
   */
  afterDev?: (params: QuasarHookParams) => void;
  /**
   * Run hook before Quasar builds app for production (`$ quasar build`).
   * At this point, the distributables folder hasn’t been created yet.
   * Can use async/await or directly return a Promise.
   */
  beforeBuild?: (params: QuasarHookParams) => void;
  /**
   * Run hook after Quasar built app for production (`$ quasar build`).
   * At this point, the distributables folder has been created and is available
   *  should you wish to do something with it.
   * Can use async/await or directly return a Promise.
   */
  afterBuild?: (params: QuasarHookParams) => void;
  /**
   * Run hook if publishing was requested (`$ quasar build -P`),
   *  after Quasar built app for production and the afterBuild hook (if specified) was executed.
   * Can use async/await or directly return a Promise.
   * `opts` is Object of form `{arg, distDir}`,
   * where “arg” is the argument supplied (if any) to -P parameter.
   */
  onPublish?: (ops: { arg: string; distDir: string }) => void;
}

/**
 * Following properties of `build` are automatically configured by Quasar CLI
 *  depending on dev/build commands and Quasar mode.
 * You can override some, but make sure you know what you are doing.
 */
interface QuasarDynamicBuildConfiguration {
  /**
   * Set to `false` to disable minification, or specify the minifier to use.
   * Available options are 'terser' or 'esbuild'.
   * If set to anything but boolean false then it also applies to CSS.
   * For production only.
   * @default 'esbuild'
   */
  minify?: boolean | 'terser' | 'esbuild';
  /**
   * Minification options for html-minifier-terser.
   *
   * @see https://github.com/terser/html-minifier-terser?tab=readme-ov-file#options-quick-reference for complete list of options
   *
   * @default
   *  {
   *    removeComments: true,
   *    collapseWhitespace: true,
   *    removeAttributeQuotes: true,
   *    collapseBooleanAttributes: true,
   *    removeScriptTypeAttributes: true
   *  }
   */
  htmlMinifyOptions?: HtmlMinifierOptions;
  /**
   * If `true`, a separate sourcemap file will be created. If 'inline', the
   * sourcemap will be appended to the resulting output file as data URI.
   * 'hidden' works like `true` except that the corresponding sourcemap
   * comments in the bundled files are suppressed.
   * @default false
   */
  sourcemap?: boolean | 'inline' | 'hidden';
}

export type QuasarBuildConfiguration = QuasarStaticBuildConfiguration &
  QuasarDynamicBuildConfiguration;
