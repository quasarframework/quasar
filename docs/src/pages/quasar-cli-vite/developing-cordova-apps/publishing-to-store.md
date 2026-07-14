---
title: Publishing to Stores
desc: (@quasar/app-vite) How to publish a Quasar Cordova app to Google Play and the Apple App Store.
---

Quasar builds the web application and prepares the Cordova project. Android Studio, Xcode, Cordova's platform tooling, and the store portals handle signing and submission.

::: warning
Store policies, target SDK requirements, signing workflows, and developer-program details change regularly. Treat the platform documentation linked below as authoritative.
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
