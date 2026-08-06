import markers from './markers.js'

// static answers so the scripts stay non-interactive (CI/e2e safe)
export default function qe2ePrompts() {
  return {
    greeting: markers.promptGreeting
  }
}
