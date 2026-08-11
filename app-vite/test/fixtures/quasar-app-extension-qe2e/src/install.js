import markers from './markers.js'

export default function qe2eInstall(api) {
  // relative to this script's folder; the scope routes the prompts
  // answer into the rendered template
  api.render('./templates', { greeting: api.prompts.greeting })
  api.onExitLog(markers.installExitLog)
}
