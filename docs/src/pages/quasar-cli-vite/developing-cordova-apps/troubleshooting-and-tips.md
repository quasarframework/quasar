---
title: Cordova Troubleshooting and Tips
desc: (@quasar/app-vite) Tips and troubleshooting for a Quasar hybrid mobile app with Cordova.
---

## $q.cordova

In Cordova mode, `$q.cordova` provides the global Cordova object in Vue components. Plugin APIs may expose additional globals after the `deviceready` event.

## Development app shows a blank screen

During `quasar dev -m cordova`, Quasar temporarily points `/src-cordova/config.xml > content` at the development server. The selected address must be reachable from the emulator or physical device.

Check that:

- the device and development machine can reach each other over the network
- the selected host belongs to the correct network interface
- the firewall permits the development-server port
- a VPN, proxy, guest Wi-Fi, or client-isolation setting is not blocking traffic
- the development URL opens in the device browser

Inspect the WebView console for the exact network or certificate error. Quasar restores the original `config.xml` content URL when the Cordova process stops.

## Android

Use Chrome's [WebView remote debugging](https://developer.chrome.com/docs/devtools/remote-debugging/webviews) to inspect an Android device or emulator. Open `chrome://inspect` after enabling USB debugging and connecting the device.

Accept SDK licenses with `sdkmanager --licenses`. Set `ANDROID_HOME` and the current `cmdline-tools/latest/bin` and `platform-tools` paths as described on the [Preparation](/quasar-cli-vite/developing-cordova-apps/preparation) page. Run these commands to inspect the installed toolchain and device connection:

```bash
cordova requirements android
adb devices
```

On Linux, follow Android's current [hardware-device setup](https://developer.android.com/studio/run/device#setting-up) instructions rather than applying a generic permissive udev ruleset.

Do not accept Android Studio upgrades automatically. The compatible Java, Gradle, Android Gradle Plugin, SDK, and build-tools versions depend on the installed `cordova-android` version.

## iOS

Use Safari Web Inspector to inspect an app on an iOS device or simulator. Enable Web Inspector on the device and Safari's Develop menu, then select the app's WebView.

If a simulator requested through additional Cordova arguments no longer exists, list the installed devices with `xcrun simctl list devices` and pass a currently available target using the syntax supported by your `cordova-ios` version.

## Debugging a production build

If development mode works but a production build does not:

1. Build the web assets with `quasar build -m cordova -T [android|ios] --skip-pkg`.
2. From `/src-cordova`, run or build the prepared native project with Cordova CLI, or open it in the native IDE.
3. Inspect the Android WebView and Logcat or the iOS WebView and Xcode logs.

Do not edit `/src-cordova/www` directly; Quasar overwrites it. Fix application code under `/src` and rebuild.

## Safe areas

Quasar components such as QHeader, QFooter, and Notify account for common safe-area cases. Test multiple devices and orientations. Custom layout elements can use the standard CSS environment variables:

```css
body.cordova .app-header {
  padding-top: env(safe-area-inset-top, 0px);
}

body.cordova .app-footer {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
```

## Disable iOS overscroll

To disable the rubber-band overscroll effect, add this preference to `/src-cordova/config.xml`:

```xml
<preference name="DisallowOverscroll" value="true" />
```
