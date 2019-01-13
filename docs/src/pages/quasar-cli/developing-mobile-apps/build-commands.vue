<template lang="pug">
doc-page(
  title="Mobile App Build Commands"
)

  div
    doc-link(to="/guide/quasar-cli.html") Quasar CLI
    | makes it incredibly simple to develop or build the final distributables from your source code.

  div Before we dive in, make sure you got the Cordova CLI installed.
    code-markup(lang="bash")
      | $ yarn global add cordova
      | # or:
      | $ npm install -g cordova

  doc-section.h2(title="Developing")

  div
    code-markup(lang="bash")
      | $ quasar dev -m cordova -T [ios|android]
      |
      | # ..or the longer form:
      | $ quasar dev --mode cordova -T [ios|android]
      |
      | # with a specific Quasar theme, for iOS platform:
      | $ quasar dev -m cordova -T ios -t ios
      |
      | # with a specific Quasar theme, for Android platform:
      | $ quasar dev -m cordova -T android -t mat
      |
      | # using a specific emulator (--emulator, -e)
      | $ quasar dev -m cordova -T ios -e iPhone-7

  doc-warning(title="IMPORTANT")
    div You can develop with any Quasar theme, regardless of the platform you are building on (Android, IOS, ...).

  div In order for you to be able to develop on a device emulator or directly on a phone (with Hot Module Reload included), Quasar CLI follows these steps:
    ol
      li Detects your machine's external IP address. If there are multiple such IPs detected, then it asks you to choose one. If you'll be using a mobile phone to develop then choose the IP address of your machine that's pingable from the phone/tablet.
      li It starts up a development server on your machine.
      li It temporarily changes the `<content/>` tag in `/src-cordova/config.xml` to point to the IP previously detected. This allows the app to connect to the development server.
      li It defers to Cordova CLI to build a native app with the temporarily changed config.xml.
      li Cordova CLI checks if a mobile phone / tablet is connected to your development machine. If it is, it installs the development app on it. If none is found, then it boots up an emulator and runs the development app.
      li Finally, it reverts the temporary changes made to `/src-cordova/config.xml`.

  doc-warning(title="IMPORTANT")
    div If developing on a mobile phone/tablet, it is very important that the external IP address of your build machine is accessible from the phone/tablet, otherwise you'll get a development app with white screen only. Also check your machine's firewall to allow connections to the development chosen port.

  doc-section.h2(title="Building for Production")
  div
    code-markup(lang="bash")
      | $ quasar build -m cordova -T [ios|android]
      |
      | # ..or the longer form:
      | $ quasar build --mode cordova -T [ios|android]
      |
      | # with a specific Quasar theme, for iOS platform:
      | $ quasar build -m cordova -T ios -t ios
      |
      | # with a specific Quasar theme, for Android platform:
      | $ quasar build -m cordova -T android -t mat

  doc-warning(title="IMPORTANT")
    div You can build with any Quasar theme, regardless of the platform you are targeting (Android, IOS, ...).

  div These commands parse and build your `/src` folder then overwrite `/src-cordova/www` then defer to Cordova CLI to trigger the actual native app creation.

  div You may ask yourself. So where's the .apk or .app? Watch the terminal console to see where it puts it.
</template>

<script>
export default {
  name: 'BuildCommands',

  meta: {
    title: 'BuildCommands'
  }
}
</script>
