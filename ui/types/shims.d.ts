// Mocks electron module avoiding TS errors when the dependency has not been installed.
// When it's installed, this is overriden by correct typings which are then applied to QVueGlobals
// This is needed because electron typings are into the main package and would force
//  us to require the full package even when electron is not used just to avoid a TS "missing type" error
declare module "electron" {}
