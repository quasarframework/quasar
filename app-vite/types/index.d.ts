// `quasar` package has some Quasar CLI-specific features, e.g. $q.cordova, 'quasar/wrappers', etc.
// Those types should not be available in there when not using Quasar CLI
// So, we augment the `quasar` package with these features from each engine (app-vite, app-webpack)

import "./globals";
export * from "./bex";
export * from "./ssr";
export * from "./store";
export * from "./prefetch";
export * from "./boot";
export * from "./configuration";
export * from "./route";
export * from "./ssrmiddleware";
export * from "./app-extension";
import "./ui-wrappers";
