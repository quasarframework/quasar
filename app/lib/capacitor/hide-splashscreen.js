import { Plugins } from '@capacitor/core'
const { SplashScreen } = Plugins

export default ({ app }) => {
  app.mounted = () => {
    SplashScreen.hide()
  }
}
