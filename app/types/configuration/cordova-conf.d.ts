export type QuasarCordovaTargets =
  | "android"
  | "ios"
  | "blackberry10"
  | "browser"
  | "osx"
  | "ubuntu"
  | "webos"
  | "windows";

export interface QuasarCordovaConfiguration {
  /** If not present, will look for `package.json > version` */
  version?: string;
  /** If not present, will look for `package.json > description` */
  description?: string;
  androidVersionCode?: string;
  /**
   * Enable Xcode modern build even if after considering iOS-Cordova issues.
   * You can enable it if you know what you are doing,
   *  for example if you want to specify the build type in your “build.json”.
   *
   * @default false
   */
  noIosLegacyBuildFlag?: boolean;
}
