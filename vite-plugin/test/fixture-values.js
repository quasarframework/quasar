// Single source for values the test suites pin from fixture/source
// files they do not own (see the repo AGENTS.md testing convention).
// The playground fixtures carry breadcrumb comments pointing back here;
// the ui package's variables are its public styling contract, so they
// are documented here instead of being annotated over there.

// vite-plugin/playground/src/quasar-variables.sass
export const playgroundVariables = {
  // $toolbar-padding override
  toolbarPadding: '100px'
}

// vite-plugin/playground/src/components/sass-transform/PlainTest.vue
export const plainTestPadding = '25px'

// ui/src/css/variables.sass — the framework defaults
export const uiDefaults = {
  // $toolbar-padding: 0 12px
  toolbarPadding: '0px 12px',
  // $flex-gutter-sm = $space-base (16px) * .5
  flexGutterSm: '8px',
  // $flex-gutter-xs = $space-base (16px) * .25
  flexGutterXs: '4px'
}
