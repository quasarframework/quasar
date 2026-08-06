import markers from './markers.js'

export default function qe2eUninstall(api) {
  api.removePath(markers.renderedDirName)
  api.onExitLog(markers.uninstallExitLog)
}
