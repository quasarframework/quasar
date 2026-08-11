export type QuasarCordovaTargets =
  | "android"
  | "ios"
  | "blackberry10"
  | "browser"
  | "electron"
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
   * Function to return the Cordova build command parameters that
   * will be executed after the UI has compiled.
   *
   * @param context.debug - True if in debug mode
   * @param context.target - The target platform
   * @returns Array of strings (command parameters)
   *
   * @default: [ 'build', '--debug'/'--release', '--device', 'ios'/'android' ]
   * @example: ({ debug, target }) => [ 'build', `--${debug ? 'debug' : 'release'}`, '--device', target ]
   */
  getCordovaBuildParams?: (context: {
    readonly debug: boolean;
    readonly target: QuasarCordovaTargets;
  }) => string[];

  /**
   * Function to return the Cordova output folder after the "cordova build"
   * command is executed.
   * The relative to /src-cordova path is used to copy the Cordova output
   * to the /dist folder.
   *
   * @param context.debug - True if in debug mode
   * @param context.target - The target platform
   * @returns string | string[] | undefined - (relative path(s) from /src-cordova)
   *
   * @default ios: platforms/ios/build/... and android: platforms/android/app/build/outputs
   * @example:
   *    ({ debug, target }) => {
   *       return target === 'ios'
   *          ? `platforms/ios/build/${debug ? 'Debug' : 'Release'}-iphoneos`
   *          : 'platforms/android/app/build/outputs'
   *    }
   * @example: (when interested in only one platform, leaving the other to the default value)
   *    ({ debug, target }) => {
   *       if (target === 'ios') {
   *          return `platforms/ios/build/${debug ? 'Debug' : 'Release'}-iphoneos`
   *       }
   *    }
   * @example: ()
   *    ({ debug, target }) => {
   *       if (target === 'ios') {
   *          // try these two folders
   *          return [ 'platforms/ios/build/device', 'platforms/ios/build/emulator' ]
   *       }
   *    }
   */
  getCordovaBuildOutputFolder?: (context: {
    readonly debug: boolean;
    readonly target: QuasarCordovaTargets;
  }) => string | string[] | undefined;
}
