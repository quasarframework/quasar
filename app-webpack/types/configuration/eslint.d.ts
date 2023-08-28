import { ESLint } from "eslint";
import { Options as WebpackEslintOptions } from 'eslint-webpack-plugin';

export interface QuasarEslintConfiguration {
  /**
   * Should it report warnings?
   * @default false
   */
  warnings?: boolean;

  /**
   * Should it report errors?
   * @default false
   */
  errors?: boolean;

  /**
   * Fix on save.
   * @default false
   */
  fix?: boolean;

  /**
   * Raw options to send to ESLint for Esbuild
   */
  rawEsbuildEslintOptions?: Omit<
    ESLint.Options,
    "cache" | "cacheLocation" | "fix" | "errorOnUnmatchedPattern"
  >;

  /**
   * Raw options to send to ESLint Webpack plugin
   */
  rawWebpackEslintPluginOptions?: WebpackEslintOptions;

  /**
   * Files to include (can be in glob format; for Esbuild ESLint only)
   */
  include?: string[];

  /**
   * Files to exclude (can be in glob format).
   * Recommending to use .eslintignore file instead.
   * @default ['node_modules']
   */
  exclude?: string[];

  /**
   * Enable or disable caching of the linting results.
   * @default true
   */
  cache?: boolean;

  /**
   * Formatter to use
   * @default 'stylish'
   */
  formatter?: ESLint.Formatter;
}
