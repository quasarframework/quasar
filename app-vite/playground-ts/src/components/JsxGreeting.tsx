// proves quasar.config file > build > vueJsx compiles .tsx files against
// Vue's JSX runtime, and that Quasar components accept the props Vue
// allows on any component (class, style, ...) in TSX; the rendered text
// is asserted by the e2e suites, so keep it in sync with
// /app-vite/test/playground-suite.js > fixtureMarkers
import { QBadge } from 'quasar'

export default function JsxGreeting({ text }: { text: string }) {
  return <QBadge class="q-ma-sm" color="accent" label={text} />
}
