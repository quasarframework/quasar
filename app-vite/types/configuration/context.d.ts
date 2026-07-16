import type * as ElectronBuilder from "electron-builder";

import type { QuasarAppPaths } from "../app-paths.d.ts";
import type { QuasarLogger } from "../logger.d.ts";
import type { QuasarCapacitorTargets } from "./capacitor-conf.d.ts";
import type { QuasarCordovaTargets } from "./cordova-conf.d.ts";
import type {
  ElectronBuilderArchs,
  ElectronBuilderTargets,
  ElectronPackagerArchs,
  ElectronPackagerTargets,
  QuasarElectronBundlers
} from "./electron-conf.d.ts";

export type QuasarMode =
  | "spa"
  | "ssr"
  | "ssg"
  | "pwa"
  | "cordova"
  | "capacitor"
  | "electron"
  | "bex";

interface BaseQuasarContext {
  /** True if we are in development mode */
  readonly dev: boolean;
  /** True if we are in production mode */
  readonly prod: boolean;
  /** App mode */
  readonly mode: { [index in QuasarMode]: boolean };
  readonly modeName: QuasarMode;
  /** True if debugging is enabled */
  readonly debug: boolean;
  /** True if opening remote Vue Devtools in development mode. */
  readonly vueDevtools: boolean;
  /**
   * Util dealing with app paths
   * @type paths {@link QuasarAppPaths}
   */
  readonly appPaths: QuasarAppPaths;
  /**
   * Logging helpers matching the Quasar CLI output style.
   * @type logger {@link QuasarLogger}
   */
  readonly logger: QuasarLogger;
}

interface CapacitorQuasarContext extends BaseQuasarContext {
  readonly mode: {
    spa: false;
    ssr: false;
    ssg: false;
    pwa: false;
    capacitor: true;
    cordova: false;
    electron: false;
    bex: false;
  };
  readonly modeName: "capacitor";
  /**
   * App target.
   *
   * @default 'none'
   */
  readonly target: {
    [index in QuasarCapacitorTargets]?: true;
  };
  /** App target name. */
  readonly targetName: QuasarCapacitorTargets;
}

interface CordovaQuasarContext extends BaseQuasarContext {
  readonly mode: {
    spa: false;
    ssr: false;
    ssg: false;
    pwa: false;
    capacitor: false;
    cordova: true;
    electron: false;
    bex: false;
  };
  readonly modeName: "cordova";
  /**
   * App target.
   *
   * @default 'all installed'
   */
  readonly target: {
    [index in QuasarCordovaTargets]?: true;
  };
  /** App target name. */
  readonly targetName: QuasarCordovaTargets;
}

interface BaseElectronQuasarContext extends BaseQuasarContext {
  readonly mode: {
    spa: false;
    ssr: false;
    ssg: false;
    pwa: false;
    capacitor: false;
    cordova: false;
    electron: true;
    bex: false;
  };
  readonly modeName: "electron";
  readonly bundler: { [index in QuasarElectronBundlers]?: true };
  readonly bundlerName: QuasarElectronBundlers;
}

interface ElectronBuilderQuasarContext extends BaseElectronQuasarContext {
  readonly bundler: { builder: true };
  readonly bundlerName: "builder";
  /**
   * App target.
   *
   * @default 'current system'
   */
  readonly target: {
    [index in ElectronBuilderTargets]?: true;
  };
  /** App target name. */
  readonly targetName: ElectronBuilderTargets;
  readonly arch: {
    [index in ElectronBuilderArchs]?: true;
  };
  readonly archName: ElectronBuilderArchs;
  /**
   * Publish options.
   *
   * If not set, its default value is deduced by the environment.
   * See https://www.electron.build/configuration/publish#how-to-publish
   */
  readonly publish?: "onTag" | "onTagOrDraft" | "always" | "never";
  /**
   * Electron-builder configuration for publishing.
   * See https://www.electron.build/configuration
   */
  readonly builder: ElectronBuilder.Configuration;
}

interface ElectronPackagerQuasarContext extends BaseElectronQuasarContext {
  readonly bundler: { packager: true };
  readonly bundlerName: "packager";
  /**
   * App target.
   *
   * @default 'current system'
   */
  readonly target: {
    [index in ElectronPackagerTargets]?: true;
  };
  /** App target name. */
  readonly targetName: ElectronPackagerTargets;
  readonly arch: {
    [index in ElectronPackagerArchs]?: true;
  };
  readonly archName: ElectronPackagerArchs;
}

type ElectronQuasarContext =
  | ElectronBuilderQuasarContext
  | ElectronPackagerQuasarContext;

interface SpaQuasarContext extends BaseQuasarContext {
  readonly mode: {
    spa: true;
    ssr: false;
    ssg: false;
    pwa: false;
    capacitor: false;
    cordova: false;
    electron: false;
    bex: false;
  };
  readonly modeName: "spa";
}

interface PwaQuasarContext extends BaseQuasarContext {
  readonly mode: {
    spa: false;
    ssr: false;
    ssg: false;
    pwa: true;
    capacitor: false;
    cordova: false;
    electron: false;
    bex: false;
  };
  readonly modeName: "pwa";
}

interface SsrQuasarContext extends BaseQuasarContext {
  readonly mode: {
    spa: false;
    ssr: true;
    ssg: false;
    pwa: boolean;
    capacitor: false;
    cordova: false;
    electron: false;
    bex: false;
  };
  readonly modeName: "ssr";
}

interface SsgQuasarContext extends BaseQuasarContext {
  readonly mode: {
    spa: false;
    ssr: false;
    ssg: true;
    pwa: boolean;
    capacitor: false;
    cordova: false;
    electron: false;
    bex: false;
  };
  readonly modeName: "ssg";
}

type QuasarBexTargets = "chrome" | "firefox";
interface BexQuasarContext extends BaseQuasarContext {
  readonly mode: {
    spa: false;
    ssr: false;
    ssg: false;
    pwa: boolean;
    capacitor: false;
    cordova: false;
    electron: false;
    bex: true;
  };
  readonly modeName: "bex";
  /**
   * App target.
   */
  readonly target: Partial<Record<QuasarBexTargets, true>>;
  /** App target name. */
  readonly targetName: QuasarBexTargets;
}

/**
 * Quasar ctx (context) object.
 */
export type QuasarContext =
  | SpaQuasarContext
  | PwaQuasarContext
  | SsrQuasarContext
  | SsgQuasarContext
  | CapacitorQuasarContext
  | CordovaQuasarContext
  | ElectronQuasarContext
  | BexQuasarContext;

type CacheProxyModuleKey =
  | "animations"
  | "capCli"
  | "cssVariables"
  | "electron"
  | "hasTypescript"
  | "nodePackager"
  | "storeProvider"
  | "workboxBuild";
export interface CacheProxy {
  readonly getRuntime: (key: string, getInitialValue: () => any) => any;
  readonly getAsyncRuntime: (
    key: string,
    getInitialValue: () => Promise<any>
  ) => Promise<any>;
  readonly setRuntime: (key: string, value: any) => void;
  readonly getModule: (key: CacheProxyModuleKey) => Promise<any>;
}

/**
 * @internal
 */
export type InternalQuasarContext = QuasarContext & {
  pkg: {
    appPkg: Record<string, any>;
    quasarPkg: Record<string, any>;
    vitePkg: Record<string, any>;
  };
  cacheProxy: CacheProxy;
  // TODO: add proper type
  appExt: any;
};
