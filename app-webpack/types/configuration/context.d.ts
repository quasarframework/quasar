import * as ElectronBuilder from "electron-builder";
import { QuasarCapacitorTargets } from "./capacitor-conf";
import {
  QuasarElectronBundlers,
  ElectronBuilderTargets,
  ElectronBuilderArchs,
  ElectronPackagerTargets,
  ElectronPackagerArchs,
} from "./electron-conf";
import { QuasarCordovaTargets } from "./cordova-conf";

type QuasarModes = "spa" | "ssr" | "pwa" | "cordova" | "capacitor" | "electron";

interface BaseQuasarContext {
  /** True if we are in development mode */
  dev: boolean;
  /** True if we are in production mode */
  prod: boolean;
  /** App mode */
  mode: { [index in QuasarModes]?: true };
  modeName: QuasarModes;
  /** True if debugging is enabled */
  debug: boolean;
}

interface CapacitorQuasarContext extends BaseQuasarContext {
  mode: { capacitor: true };
  modeName: "capacitor";
  /**
   * App target.
   *
   * @default 'none'
   */
  target: {
    [index in QuasarCapacitorTargets]?: true;
  };
  /** App target name. */
  targetName: QuasarCapacitorTargets;
}

interface CordovaQuasarContext extends BaseQuasarContext {
  mode: { cordova: true };
  modeName: "cordova";
  /**
   * App target.
   *
   * @default 'all installed'
   */
  target: {
    [index in QuasarCordovaTargets]?: true;
  };
  /** App target name. */
  targetName: QuasarCordovaTargets;
  /**
   * Emulator name, may be present only for Cordova mode.
   *
   * @example
   * 'iPhone-7', 'iPhone-X', 'iPhone-X', 'com.apple.CoreSimulator.SimRuntime.iOS-12-2'
   */
  emulator: string;
}

interface BaseElectronQuasarContext extends BaseQuasarContext {
  mode: { electron: true };
  modeName: "electron";
  bundler: { [index in QuasarElectronBundlers]?: true };
  bundlerName: QuasarElectronBundlers;
}

interface ElectronBuilderQuasarContext extends BaseElectronQuasarContext {
  bundler: { builder: true };
  bundlerName: "builder";
  /**
   * App target.
   *
   * @default 'current system'
   */
  target: {
    [index in ElectronBuilderTargets]?: true;
  };
  /** App target name. */
  targetName: ElectronBuilderTargets;
  arch: {
    [index in ElectronBuilderArchs]?: true;
  };
  archName: ElectronBuilderArchs;
  /**
   * Publish options.
   *
   * If not set, its default value is deduced by the environment.
   * See https://www.electron.build/configuration/publish#how-to-publish
   */
  publish?: "onTag" | "onTagOrDraft" | "always" | "never";
  /**
   * Electron-builder configuration for publishing.
   * See https://www.electron.build/configuration/configuration
   */
  builder: ElectronBuilder.Configuration;
}

interface ElectronPackagerQuasarContext extends BaseElectronQuasarContext {
  bundler: { packager: true };
  bundlerName: "packager";
  /**
   * App target.
   *
   * @default 'current system'
   */
  target: {
    [index in ElectronPackagerTargets]?: true;
  };
  /** App target name. */
  targetName: ElectronPackagerTargets;
  arch: {
    [index in ElectronPackagerArchs]?: true;
  };
  archName: ElectronPackagerArchs;
}

type ElectronQuasarContext =
  | ElectronBuilderQuasarContext
  | ElectronPackagerQuasarContext;

interface SpaQuasarContext extends BaseQuasarContext {
  mode: { spa: true };
  modeName: "spa";
}

interface PwaQuasarContext extends BaseQuasarContext {
  mode: { pwa: true };
  modeName: "pwa";
}

interface SsrQuasarContext extends BaseQuasarContext {
  mode: { ssr: true };
  modeName: "ssr";
}

export type QuasarContext =
  | SpaQuasarContext
  | PwaQuasarContext
  | SsrQuasarContext
  | CapacitorQuasarContext
  | CordovaQuasarContext
  | ElectronQuasarContext;
