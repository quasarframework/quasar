/**
 * Must stay the FIRST import of the UMD entry (and listed in
 * package.json > sideEffects): it has to evaluate before any module
 * reads from the externalized `vue` global, otherwise a missing Vue
 * surfaces as a cryptic TypeError instead of this message.
 */

if (window.Vue === void 0) {
  console.error(
    '[ Quasar ] Vue is required to run. Please add a script tag for it before loading Quasar.'
  )
}
