import { BuildOptions as EsbuildConfiguration } from "esbuild";

interface QuasarBexConfiguration {
  /**
   * The list of content scripts (js/ts) that you want embedded.
   * Each entry in the list should be a filename (WITHOUT its extension) from /src-bex/
   *
   * @example [ 'my-content-script' ]
   */
  contentScripts?: string[];

  /**
   * Extend the esbuild config that is used for the bex scripts
   * (background, content scripts, dom script)
   */
  extendBexScriptsConf?: (config: EsbuildConfiguration) => void;

  /**
   * Should you need some dynamic changes to the Browser Extension manifest file
   * (/src-bex/manifest.json) then use this method to do it.
   */
  extendBexManifestJson?: (json: object) => void;
}
