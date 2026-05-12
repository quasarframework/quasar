// Forces TS to apply `@quasar/app-vite` augmentations of the `quasar` package
// (e.g. adds `$q` into Vue component context) and exposes the wrappers
// (`defineBoot`, `defineRouter`, etc.) shipped from `@quasar/app-vite`.
/// <reference types="@quasar/app-vite" />

// Load global component typings
/// <reference types="<%= scope.pkgName %>" />
