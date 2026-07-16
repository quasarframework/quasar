import type { RolldownOptions } from "rolldown";

export interface QuasarBexConfiguration {
  /**
   * Minify the browser extension build.
   *
   * @default false
   */
  minify?: boolean;

  /**
   * The list of extra scripts (js/ts) not in your bex manifest that you want to
   * compile and use dynamically in your browser extension.
   *
   * Each entry in the list should be a relative filename to /src-bex/
   *
   * @example [ 'my-script.ts', 'sub-folder/my-other-script.js' ]
   */
  extraScripts?: string[];

  /**
   * Extend the Rolldown config that is used for the bex scripts
   * (background, content scripts, dom script).
   *
   * Can be async. Can directly modify the "config" parameter or
   * return a new one that will be merged with the default one.
   *
   * @param config {@link RolldownOptions}
   */
  extendBexScriptsConf?: (
    config: RolldownOptions
  ) => void | RolldownOptions | Promise<void | RolldownOptions>;

  /**
   * Should you need some dynamic changes to the Browser Extension manifest file
   * (/src-bex/manifest.json) then use this method to do it.
   *
   * Can be async. Can directly modify the "json" parameter or
   * return a new one that will be merged with the default one.
   */
  extendBexManifestJson?: (
    json: Record<string, any>
  ) => void | Record<string, any> | Promise<void | Record<string, any>>;
}
