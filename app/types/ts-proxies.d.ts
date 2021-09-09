// Import all optional peer dependencies types here to centralize all ts-ignore commands
// These types will have `any` type at runtime until the appropriate package is installed
// If we just used with normal imports where needed, we would get TS compilation errors
// and would need to ts-ignore each import

// "electron-builder" 22 after a given minor version have a dependency which requires Node 14,
// we pinned it to avoid forcing people contributing to quasar to switch to Node 14
// Into devland this is a problem under the end user control
// @ts-ignore
import type * as ElectronBuilderProxy from "electron-builder";
// "builder-util" is an internal dependency of ElectronBuilder and will be there even when not installed as devDependency
// @ts-ignore
import type * as ElectronBuilderUtilProxy from "builder-util";
// @ts-ignore
import type * as ElectronPackagerProxy from "electron-packager";

export {
  ElectronBuilderProxy,
  ElectronBuilderUtilProxy,
  ElectronPackagerProxy,
};
