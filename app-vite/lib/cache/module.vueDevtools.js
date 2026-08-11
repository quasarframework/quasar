import { getPackage } from '../utils/get-package.js'

export async function createInstance({ appPaths }) {
  const { default: vitePluginVueDevtools } = await getPackage(
    'vite-plugin-vue-devtools',
    appPaths.appDir
  )

  return vitePluginVueDevtools
}
