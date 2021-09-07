// Import all optional peerDependencies types here to centralize all ts-ignore commands
// These types will have `any` type at runtime until the appropriate package is installed
// @ts-ignore
import type * as ElectronBuilderProxy from "electron-builder";
// @ts-ignore
import type * as ElectronBuilderUtilProxy from "builder-util";
// @ts-ignore
import type * as ElectronPackagerProxy from "electron-packager";

export {
  ElectronBuilderProxy,
  ElectronBuilderUtilProxy,
  ElectronPackagerProxy,
};
