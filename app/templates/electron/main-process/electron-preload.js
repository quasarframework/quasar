/**
 * This file is used specifically for security reasons.
 * Here you can access Node and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * WARNING!
 * Do not import files here with relative path. This file will be copied to the
 * final bundle as-is without any dependency tracking. So, do NOT split it into
 * multiple files and import them here.
 *
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   const { contextBridge } = require('electron')
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 */
