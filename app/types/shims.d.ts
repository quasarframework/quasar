// Mocks electron module avoiding TS errors when the dependency has not been installed.
// When it's installed, this is overridden by correct typings which are then applied to QVueGlobals
// This is needed because electron typings are into the main package and would force
//  us to require the full package even when electron is not used
declare module "electron" {}

// Mocks electron-builder module avoiding TS errors when the dependency has not been installed.
// When it's installed, this is overridden by correct typings which are then applied to ElectronBuilderConfiguration
// This is needed because electron-builder typings are into the main package and would force
//  us to require the full package even when electron-builder is not used
declare module "electron-builder" {
  type Configuration = any;
}
