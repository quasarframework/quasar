/**
 * Resolves the path to the electron-assets directory, adapting to
 * development or production environments.
 * @param args Path segments to join to the base electron-assets path
 * @returns The fully resolved path
 */
export declare function resolveElectronAssetsPath(...args: string[]): string;

/**
 * The resolved path to the electron-assets directory, determined at runtime
 */
export declare const electronAssetsDir: string;

/**
 * Resolves the path to the public directory, adapting to
 * development or production environments.
 * @param args Path segments to join to the base public path
 * @returns The fully resolved path
 */
export declare function resolvePublicPath(...args: string[]): string;

/**
 * The resolved path to the public directory, determined at runtime
 */
export declare const publicDir: string;

/**
 * Registers IPC handlers for the Quasar Electron runtime.
 * This allows the preload script and renderer process to request
 * resolved asset and public paths synchronously via `ipcRenderer.sendSync`.
 */
export declare function registerQuasarRuntime(): void;
