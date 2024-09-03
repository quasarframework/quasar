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

  /**
   * Function to return the Cordova build command parameters that
   * will be executed after the UI has compiled.
   *
   * @param context.debug - True if in debug mode
   * @param context.target - The target platform (ios/android)
   * @returns Array of strings (command parameters)
   *
   * @default: [ 'build', '--debug'/'--release', '--device', 'ios'/'android' ]
   * @example: ({ isDebug, target }) => [ 'build', `--${isDebug ? 'debug' : 'release'}`, '--device', 'target' ]
   */
  getCordovaBuildParams?: (context: { debug: boolean; target: 'ios' | 'android' }) => string[];

  /**
   * Function to return the Cordova output folder after the "cordova build"
   * command is executed.
   * The relative to /src-cordova path is used to copy the Cordova output
   * to the /dist folder.
   *
   * @param context.debug - True if in debug mode
   * @param context.target - The target platform (ios/android)
   * @returns string | string[] | undefined - (relative path(s) from /src-cordova)
   *
   * @default ios: platforms/ios/build/... and android: platforms/android/app/build/outputs
   * @example:
   *    ({ isDebug, target }) => {
   *       return target === 'ios'
   *          ? `platforms/ios/build/${isDebug ? 'Debug' : 'Release'}-iphoneos
   *          : 'platforms/android/app/build/outputs'
   *    }
   * @example: (when interested in only one platform, leaving the other to the default value)
   *    ({ isDebug, target }) => {
   *       if (target === 'ios') {
   *          return `platforms/ios/build/${isDebug ? 'Debug' : 'Release'}-iphoneos`
   *       }
   *    }
   * @example: ()
   *    ({ isDebug, target }) => {
   *       if (target === 'ios') {
   *          // try these two folders
   *          return [ 'platforms/ios/build/device', 'platforms/ios/build/emulator' ]
   *       }
   *    }
   */
  getCordovaBuildOutputFolder?: (context: { debug: boolean; target: 'ios' | 'android' }) => string | string[] | undefined;
}
