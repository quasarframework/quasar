import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import open from 'open'

import { fatal, warn } from './logger.js'

function findXcodeWorkspace(folder) {
  const items = fs.readdirSync(folder)

  // Prefer the .xcworkspace: it's the CocoaPods-integrated container that
  // links the Pods providing the Capacitor module. readdirSync() can list
  // the bare .xcodeproj first, and opening that builds without the Pods,
  // failing with "No such module 'Capacitor'".
  const target =
    items.find(item => item.endsWith('.xcworkspace')) ||
    items.find(item => item.endsWith('.xcodeproj'))

  if (target) {
    return path.join(folder, target)
  }
}

function runMacOS(mode, target, appPaths) {
  if (target === 'ios') {
    const folder =
      mode === 'cordova'
        ? appPaths.resolve.cordova('platforms/ios')
        : appPaths.resolve.capacitor('ios/App')

    return open(findXcodeWorkspace(folder), { wait: false })
  }

  const folder =
    mode === 'cordova'
      ? appPaths.resolve.cordova('platforms/android')
      : appPaths.resolve.capacitor('android')

  return open(folder, {
    app: { name: 'android studio' },
    wait: false
  })
}

function getLinuxPath(bin) {
  const canonicalPaths = [
    '/usr/local/android-studio/bin/studio.sh',
    '/opt/android-studio/bin/studio.sh'
  ]

  if (process.env.ANDROID_STUDIO_PATH) {
    canonicalPaths.push(process.env.ANDROID_STUDIO_PATH)
  }

  if (bin.linuxAndroidStudio) {
    canonicalPaths.unshift(bin.linuxAndroidStudio)
  }

  for (const studioPath of canonicalPaths) {
    if (fs.existsSync(studioPath)) {
      return studioPath
    }
  }
}

function runLinux(mode, bin, target, appPaths) {
  if (target === 'android') {
    const studioPath = getLinuxPath(bin)
    if (studioPath) {
      const folder =
        mode === 'cordova'
          ? appPaths.resolve.cordova('platforms/android')
          : appPaths.resolve.capacitor('android')

      return open(folder, {
        app: { name: studioPath },
        wait: false
      })
    }
  } else if (target === 'ios') {
    fatal('iOS target not supported on Linux')
  }

  warn('Cannot determine path to IDE executable')
  console.log(
    ' Please set quasar.config file > bin > linuxAndroidStudio with the escaped path to your studio.sh'
  )
  console.log(" Example: '/usr/local/android-studio/bin/studio.sh'")
  process.exit(1)
}

function getWindowsPath(bin) {
  if (bin.windowsAndroidStudio && fs.existsSync(bin.windowsAndroidStudio)) {
    return bin.windowsAndroidStudio
  }

  const studioPath = String.raw`C:\Program Files\Android\Android Studio\bin\studio64.exe`
  if (fs.existsSync(studioPath)) {
    return studioPath
  }

  try {
    const buffer = execSync(
      String.raw`REG QUERY "HKEY_LOCAL_MACHINE\SOFTWARE\Android Studio" /v Path`
    )
    const bufferString = buffer
      .toString('utf8')
      .replaceAll(/(\r\n|\n|\r)/gm, '')
    const index = bufferString.indexOf('REG_SZ')

    if (index > 0) {
      const asPath =
        bufferString.slice(index + 6).trim() + String.raw`\bin\studio64.exe`

      if (fs.existsSync(asPath)) {
        return asPath
      }
    }
  } catch {
    /* do and return nothing */
  }
}

function runWindows(mode, bin, target, appPaths) {
  if (target === 'android') {
    const studioPath = getWindowsPath(bin)
    if (studioPath) {
      const folder =
        mode === 'cordova'
          ? appPaths.resolve.cordova('platforms/android')
          : appPaths.resolve.capacitor('android')

      /**
       * On Windows, after calling the below function, the Node.js process
       * should NOT exit by calling process.exit(_any_code_) under any form, otherwise the
       * IDE will not get a chance to be opened.
       *
       * However, if process.exit() must still be called, a significant delay
       * (30-60 seconds, the more the better) is needed before calling it.
       */
      return open(folder, {
        app: { name: studioPath },
        wait: false
      })
    }
  } else if (target === 'ios') {
    fatal('iOS target not supported on Windows')
  }

  warn('Cannot determine path to IDE executable')
  console.log(
    ' Please set quasar.config file > bin > windowsAndroidStudio with the escaped path to your studio64.exe'
  )
  console.log(
    String.raw` Example: 'C:\\Program Files\\Android\\Android Studio\\bin\\studio64.exe'`
  )
  process.exit(1)
}

// openIDE() returns the result of an open() call (which is a Promise)
// so this function should be treated as async
export function openIDE({ mode, bin, target, dev, appPaths }) {
  console.log()
  console.log(' ⚠️  ')
  console.log(
    ` ⚠️  Opening ${target === 'ios' ? 'XCode' : 'Android Studio'} IDE. It might take a few seconds...`
  )

  if (dev) {
    console.log(' ⚠️  From there, use the IDE to run the app.')
    console.log(' ⚠️  ')
    console.log(
      ' ⚠️  DO NOT close the terminal as this will kill the devserver.'
    )
  } else {
    console.log(' ⚠️  From there, use the IDE to build the final package.')
  }

  if (target === 'android') {
    console.log(' ⚠️  ')
    console.log(
      ' ⚠️  DO NOT upgrade Gradle or any other deps if Android Studio will suggest it.'
    )
    console.log(
      ' ⚠️  If you encounter any IDE errors then click on File > Invalidate caches and restart.'
    )
  }

  console.log(' ⚠️  ')
  console.log()

  switch (process.platform) {
    case 'darwin': {
      return runMacOS(mode, target, appPaths)
    }
    case 'linux': {
      return runLinux(mode, bin, target, appPaths)
    }
    case 'win32': {
      return runWindows(mode, bin, target, appPaths)
    }
    default: {
      fatal('Unsupported host OS for opening the IDE')
    }
  }
}
