// Deliberately not an SFC: only .vue modules register themselves on
// ssrContext.modules, so this covers the CSS-through-a-shared-chunk path.
// Rendered on two pages on purpose, which is what makes Vite hoist its
// CSS into a chunk shared by both. The rendered text and the class name
// are asserted by the e2e suites; keep them in sync with
// /app-vite/test/playground-suite.js > fixtureMarkers
import { h } from "vue";

import "./SharedStyleBadge.css";

export default function SharedStyleBadge() {
  return h(
    "div",
    { class: "shared-style-badge" },
    "Styles from a shared chunk"
  );
}
