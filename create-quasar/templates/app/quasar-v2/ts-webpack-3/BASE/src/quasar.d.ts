/* eslint-disable */

// Forces TS to apply `@quasar/app-webpack` augmentations of `quasar` package
// Removing this would break `quasar/wrappers` imports as those typings are declared
//  into `@quasar/app-webpack`
// As a side effect, since `@quasar/app-webpack` reference `quasar` to augment it,
//  this declaration also apply `quasar` own
//  augmentations (eg. adds `$q` into Vue component context)
/// <reference types="@quasar/app-webpack" />
