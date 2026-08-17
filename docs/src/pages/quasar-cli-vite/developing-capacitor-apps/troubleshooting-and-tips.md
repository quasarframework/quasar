---
title: Capacitor Troubleshooting and Tips
desc: (@quasar/app-vite) Tips and troubleshooting for a Quasar hybrid mobile app with Capacitor.
---

## $q.capacitor

In Capacitor mode, `$q.capacitor` provides the Capacitor global in Vue components. For application code, you can also import the APIs you need directly from `@capacitor/core` or an installed Capacitor plugin.

## Development app shows a blank screen

During `quasar dev -m capacitor`, the native app loads the UI from Quasar's development server. The selected development-server address must be reachable from the emulator or physical device.

Check that:

- the device and development machine can reach each other over the network
- the selected host address belongs to the correct network interface
- the firewall allows the Quasar development-server port
- a VPN, proxy, guest Wi-Fi, or client-isolation setting is not blocking device-to-device traffic
- the development URL opens from the device's browser

Inspect the native WebView console for the exact connection or certificate error. If HTTPS is enabled, the device must trust the development certificate.

## Android

### Android Remote debugging

Use Chrome's [WebView remote debugging](https://developer.chrome.com/docs/devtools/remote-debugging/webviews) to inspect the app running on an Android device or emulator. Open `chrome://inspect` on the development machine after enabling USB debugging and connecting the device.

### SDK licenses and environment

Accept Android SDK licenses with:

```bash
sdkmanager --licenses
```

With a current command-line tools installation, `sdkmanager` is normally under `$ANDROID_HOME/cmdline-tools/latest/bin`. Set `ANDROID_HOME` to the SDK directory and include both that directory and `$ANDROID_HOME/platform-tools` in `PATH` as described on the [Preparation](/quasar-cli-vite/developing-capacitor-apps/preparation) page.

Use `adb devices` to confirm that a connected device is visible and authorized. On Linux, follow the current [Android hardware-device setup](https://developer.android.com/studio/run/device#setting-up) instructions for USB permissions rather than applying a generic, permissive udev ruleset.

### Native toolchain upgrades

Do not accept Android Studio upgrade suggestions automatically. Gradle, the Android Gradle Plugin, Java, and SDK requirements are tied to the Capacitor major version. Follow Capacitor's upgrade guide and commit the native project before changing them.

If Android Studio reports stale indexing or synchronization errors, first run the configured Capacitor synchronization command again. You can then try **File > Invalidate Caches** if the generated project is correct but the IDE state remains stale.

## iOS

### iOS Remote debugging

Use Safari Web Inspector to inspect an app running on an iOS device or simulator. Enable Web Inspector on the device and the Develop menu in Safari, then select the app's WebView from the connected device or simulator.

### CocoaPods and native dependencies

If Capacitor reports that CocoaPods is unavailable or Xcode cannot load a Pods configuration file, install CocoaPods using the method recommended for your environment and run `pnpm exec cap sync ios` from `/src-capacitor`. Open the generated `.xcworkspace` when CocoaPods dependencies are present.

## Status bar and safe areas

Devices can reserve space for status bars, rounded corners, camera cutouts, and home indicators. Quasar components such as QHeader, QFooter, and Notify account for common safe-area cases, but test the app on multiple device shapes and orientations.

On Android, Quasar uses the `--safe-area-inset-*` variables supplied by the [Capacitor 8 System Bars API](https://capacitorjs.com/docs/apis/system-bars) and falls back to the standard CSS environment variables. If your app handles Android safe areas itself, disable Quasar's automatic component padding:

```js /quasar.config file
framework: {
  config: {
    capacitor: {
      androidStatusBarPadding: false
    }
  }
}
```

For custom layout elements, use the same fallback:

```css
.top-element {
  padding-top: var(--safe-area-inset-top, env(safe-area-inset-top, 0px));
}

.bottom-element {
  padding-bottom: var(
    --safe-area-inset-bottom,
    env(safe-area-inset-bottom, 0px)
  );
}
```

Whether to use padding or margin depends on the layout and background you want to extend into the safe area.
