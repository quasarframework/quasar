---
title: Publishing to Stores
desc: (@quasar/app-vite) How to publish a Quasar hybrid mobile app to Google Play and the Apple App Store.
---

Store submission is handled by the native Android and iOS toolchains. Quasar builds the web application and synchronizes the Capacitor project; Android Studio, Xcode, and the store portals handle signing, packaging, and submission.

::: warning
Store policies, target SDK requirements, signing workflows, and developer-program details change regularly. Treat the platform documentation linked below as authoritative.
:::

Before creating a release:

- commit or back up native changes under `/src-capacitor`
- remove development-only endpoints, logging, and permissions
- set the native version and build numbers
- verify icons, splash screens, privacy disclosures, permissions, and production services
- test a release build on physical devices

## Google Play

Build the web assets, synchronize Capacitor, and open Android Studio:

```bash
quasar build -m capacitor -T android --ide
```

In Android Studio, use **Build > Generate Signed Bundle / APK**. Google Play normally expects an Android App Bundle (`.aab`). Configure a release signing key and keep both the key and its credentials backed up securely; losing the upload key can disrupt future releases.

Set the Android release versions in `/src-capacitor/android/app/build.gradle` (or `build.gradle.kts`, depending on the generated project):

- `versionCode` is an integer that must increase for each Play upload.
- `versionName` is the user-visible release version.

Then create or update the app in [Google Play Console](https://play.google.com/console/), complete its policy and store-listing requirements, upload the signed bundle to a testing track, and promote it after testing.

Refer to Android's current guides for [signing an app](https://developer.android.com/studio/publish/app-signing), [preparing a release](https://developer.android.com/studio/publish/preparing), and [publishing on Google Play](https://developer.android.com/studio/publish/upload-bundle).

## Apple App Store

Apple releases require macOS, Xcode, and membership in the Apple Developer Program. Build the web assets, synchronize Capacitor, and open Xcode:

```bash
quasar build -m capacitor -T ios --ide
```

In Xcode:

1. Select the app target and configure **Signing & Capabilities** with the correct team and bundle identifier.
2. Set the user-visible version and build number. Each uploaded build needs a unique build number.
3. Select a generic or connected iOS device as the destination.
4. Choose **Product > Archive**.
5. In the Organizer, validate and distribute the archive to App Store Connect.

Create the app record in [App Store Connect](https://appstoreconnect.apple.com/), select the uploaded build, complete the privacy and store metadata, test with TestFlight, and submit the release for review.

Refer to Apple's current documentation for [distributing an app through the App Store](https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases), [uploading builds](https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds-overview), and [submitting for review](https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-app-for-review).

## Command-line native builds

Without `--ide`, Quasar invokes Gradle or `xcodebuild` and places the collected native output under `/dist/capacitor/<target>`. Signing requirements still come from the native project and platform toolchain. For store releases, opening the IDE is often the clearest way to select signing identities, inspect warnings, archive, and upload the build.
