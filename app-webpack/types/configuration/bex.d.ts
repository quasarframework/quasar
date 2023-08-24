import { BuildOptions as EsbuildConfiguration } from "esbuild";

interface QuasarBexConfiguration {
  /**
   * The list of content scripts (js/ts) that you want embedded.
   * Each entry in the list should be a filename (WITHOUT its extension) from /src-bex/
   *
   * @example [ 'my-content-script' ]
   */
  contentScripts?: string[];

  /** Webpack config object for the Main Process ONLY (`/src-bex`) */
  extendWebpackMain?: (config: WebpackConfiguration) => void;
  /**
   * Equivalent to `extendWebpackMain()` but uses `webpack-chain` instead,
   *  for the Main Process ONLY (`/src-bex/`)
   */
  chainWebpackMain?: (chain: WebpackChain) => void;

  /**
   * Should you need some dynamic changes to the Browser Extension manifest file
   * (/src-bex/manifest.json) then use this method to do it.
   */
  extendBexManifestJson?: (json: object) => void;
}
