/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */

import electronDebug from 'electron-debug'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { app } from 'electron'

// Install `electron-debug` with `devtron`
electronDebug({ showDevTools: true })

// Install vuejs devtools
app.whenReady().then(() => {
  installExtension(VUEJS_DEVTOOLS)
    .then(ext => {
      console.log(`Added Extension: ${ext.name}`)
    })
    .catch(err => {
      console.log('An error occurred: ', err)
    })
})

import './electron-main'
