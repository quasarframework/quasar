// proves quasar.config file > build > vueJsx compiles .jsx files against
// Vue's JSX runtime; the rendered text is asserted by the e2e suites,
// so keep it in sync with
// /app-vite/test/playground-suite.js > fixtureMarkers
import { QBadge } from 'quasar'

export default function JsxGreeting({ text }) {
  return <QBadge class="q-ma-sm" color="accent" label={text} />
}
