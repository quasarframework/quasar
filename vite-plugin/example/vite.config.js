import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// We link directly to our plugin's source files;
// In production, it should be import { ... } from '@quasar/vite-plugin'
import { quasar, transformAssetUrls } from '../src'

export default defineConfig(({ command, mode }) => {
  return {
    plugins: [
      vue({
        template: { transformAssetUrls }
      }),

      quasar({
        sassVariables: 'src/quasar-variables.sass'
      })
    ]
  }
})
