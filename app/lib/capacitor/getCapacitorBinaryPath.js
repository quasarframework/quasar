const path = require('path')

module.exports = () => {
  try {
    // For production, to support workspaces or different cwd
    return path.join(require.resolve('@capacitor/cli'), '../../bin/capacitor')
  } catch (e) {
    // For development with `yarn link`
    return '../node_modules/.bin/capacitor'
  }
}
