---
title: Publishing to Stores
desc: (@quasar/app-vite) How to publish a Quasar Cordova app to Google Play and the Apple App Store.
---

Quasar builds the web application and prepares the Cordova project. Android Studio, Xcode, Cordova's platform tooling, and the store portals handle signing and submission.

## Android Publishing

To generate a release build for Android, we can use the following Quasar CLI command:

```bash
quasar build -m cordova -T android
# or the short form:
quasar build -m android
```

This will generate a release build based on the settings in your `/src-cordova/config.xml`.

Next, we can find our unsigned APK file in "/src-cordova/platforms/android/app/build/outputs/apk/release" or equivalent path (written in the output of terminal). Filename usually ends with "-release-unsigned.apk". Now, we need to sign the unsigned APK and run an alignment utility on it to optimize it and prepare it for the app store. If you already have a signing key, skip these steps and use that one instead.

Let’s generate our private key using the keytool command that comes with the JDK. If this tool isn’t found, refer to the installation guide:

```bash
keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 20000
```

You’ll first be prompted to create a password for the keystore. Then, answer the rest of the nice tool’s questions and when it’s all done, you should have a file called my-release-key.keystore created in the current directory.

::: danger
- Keep the keystore and its passwords out of version control and build logs. Store encrypted backups separately from the source repository and restrict access to the people or release system that signs the app. Losing the signing key can prevent you from publishing updates; leaking it can let someone sign malicious releases as your app.
- Store policies, target SDK requirements, signing workflows, and developer-program details change regularly. Treat the platform documentation linked below as authoritative.
:::

Before creating a release:

- commit or back up native changes under `/src-cordova`
- remove development-only endpoints, logging, and permissions
- set the release version and platform-specific build number
- verify icons, splash screens, privacy disclosures, plugins, permissions, and production services
- test a release build on physical devices

## Google Play

Prepare the Cordova project and open Android Studio:

```bash
quasar build -m cordova -T android --ide
```

In Android Studio, use **Build > Generate Signed Bundle / APK**. Google Play normally expects an Android App Bundle (`.aab`). Configure a release signing key and keep both the key and its credentials backed up securely.

Set the shared app version through `/quasar.config > cordova > version` or `/package.json > version`. Set `cordova.androidVersionCode` when you need to control Android's monotonically increasing version code.

Create or update the app in [Google Play Console](https://play.google.com/console/), complete its policy and store-listing requirements, upload the signed bundle to a testing track, and promote it after testing.

Refer to Android's current guides for [signing an app](https://developer.android.com/studio/publish/app-signing), [preparing a release](https://developer.android.com/studio/publish/preparing), and [publishing on Google Play](https://developer.android.com/studio/publish/upload-bundle). Also check the release documentation for the installed `cordova-android` version.

## Apple App Store

Apple releases require macOS, Xcode, and membership in the Apple Developer Program. Prepare the Cordova project and open Xcode:

```bash
quasar build -m cordova -T ios --ide
```

Open the generated workspace when the project uses CocoaPods. In Xcode:

1. Select the app target and configure **Signing & Capabilities** with the correct team and bundle identifier.
2. Set the user-visible version and build number. Each uploaded build needs a unique build number.
3. Select a generic or connected iOS device as the destination.
4. Choose **Product > Archive**.
5. In the Organizer, validate and distribute the archive to App Store Connect.

Create the app record in [App Store Connect](https://appstoreconnect.apple.com/), select the uploaded build, complete the privacy and store metadata, test with TestFlight, and submit the release for review.

Refer to Apple's current documentation for [distributing an app through the App Store](https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases), [uploading builds](https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds-overview), and [submitting for review](https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-app-for-review). Also check the release documentation for the installed `cordova-ios` version.

## Command-line builds

Without `--ide`, Quasar invokes `cordova build` and copies recognized native output under `/dist/cordova/<target>`. Customize `cordova.getCordovaBuildParams` for signing arguments or nonstandard build commands, and `cordova.getCordovaBuildOutputFolder` when a platform writes artifacts somewhere else.
