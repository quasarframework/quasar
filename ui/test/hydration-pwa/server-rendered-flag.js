// Must be the FIRST import of a hydration-pwa test file that wants
// the server-rendered boot mode: on __QUASAR_SSR_PWA__ builds the
// pre-hydration gate reads this attribute at Platform's module
// evaluation — i.e. while the importing file's module graph loads —
// so it has to exist before any quasar import evaluates. A file
// without this import boots in PWA-shell mode instead.
document.body.dataset.serverRendered = ''
