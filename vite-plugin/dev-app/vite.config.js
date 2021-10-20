import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '../index'

/**
 * https://vitejs.dev/config/
 * @type {import('vite').UserConfig}
 */
export default ({ command, mode }) => {
  return {
    plugins: [
      vue({
        template: {
          transformAssetUrls
        }
      }),

      quasar({
        // runMode: 'spa',
        autoImportComponentCase: 'kebab'
      })
    ]
  }
}
