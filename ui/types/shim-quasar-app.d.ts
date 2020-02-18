// Mocks `@quasar/app` module avoiding TS errors when the dependency has not been installed.
// When it's installed, this is overriden by correct typings which augment `quasar` typings
//  to support Quasar CLI features
declare module "@quasar/app" {}
