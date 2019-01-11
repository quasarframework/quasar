<template lang="pug">
doc-page(
  title="Sample Page"
)
  p Quasar has a component called QBtn which is a button with a few extra useful features. For instance, it comes in two shapes: rectangle (default) and round. It also has the material ripple effect by default when building with Material theme.
  p The button component also comes with a spinner or loading effect. You would use this for times when app execution may cause a delay and you want to give the user some feedback about that delay. When used, the button will display a spinning animation as soon as the user clicks the button.
  div When not disabled or spinning, QBtn emits a <doc-token>@click</doc-token> event, as soon as it is clicked or tapped.

  doc-section.h1(title="Header 1")
  p Some code markup

  doc-section.h2(title="Header 2")
  p Some code markup

  doc-section.h3(title="Header 3")
  p Some code markup

  p Warning
  doc-warning
    div Not supported in IE11.

  p Some code markup
  code-markup(lang="bash")
    | $ quasar dev -m ssr
    | # some comment
    | $ quasar build

  div Text, more text, a <doc-token>token</doc-token>, some more text. <doc-token>require('wow')</doc-token>
  div Text, more text, some more text.
  p
    | Released under the
    doc-link(to="https://github.com/quasarframework/quasar/blob/dev/LICENSE") MIT LICENSE
    | . When not disabled or spinning, QBtn emits a @click event, as soon as it is clicked or tapped.

  q-markup-table.q-mb-lg
    thead
      tr
        th.text-left Property
        th.text-left Type
        th.text-left Description
    tbody
      tr
        td color
        td String
        td The color the QInput should have. The default is primary.
      tr
        td inverted
        td Boolean
        td Set to true, to color field&rsquo;s background set by the color prop.
      tr
        td dark
        td Boolean
        td
          | Set to true, if the field is on a dark background. It will invert the text color to make it light.
      tr
        td align
        td Text
        td
          | Controls the &lsquo;right&rsquo;, &lsquo;center&rsquo; or &lsquo;left&rsquo; alignment of the input. The default is &lsquo;left&rsquo;.

  p The button component also comes with a spinner or loading effect. You would use this for times when app execution may cause a delay and you want to give the user some feedback about that delay. When used, the button will display a spinning animation as soon as the user clicks the button.

  doc-section.h1(title="Installation")
  p When not disabled or spinning, QBtn emits a @click event, as soon as it is clicked or tapped.

  InstallationCard(
    :components="['QBtn', 'QToggleBtn']"
  )
  InstallationCard(
    components="QBtn"
  )

  InstallationCard(
    components="QBtn"
    :plugins="['Meta', 'Cookies']"
    directives="Ripple"
    :config="{ notify: 'Notify' }"
  )

  InstallationCard(
    title="Meta Plugin installation"
    :plugins="['Meta']"
  )

  doc-section.h1(title="Usage")
  code-example(title="Standard", file="QBtn/Standard")

  p Quasar has a component called QBtn which is a button with a few extra useful features. For instance, it comes in two shapes: rectangle (default) and round. It also has the material ripple effect by default when building with Material theme.

  p The button component also comes with a spinner or loading effect. You would use this for times when app execution may cause a delay and you want to give the user some feedback about that delay. When used, the button will display a spinning animation as soon as the user clicks the button.

  p When not disabled or spinning, QBtn emits a @click event, as soon as it is clicked or tapped.

  doc-section.h1(title="API")
  ApiCard(file="QUploader")
  ApiCard(file="TouchSwipe")
  ApiCard(file="AppFullscreen")
  ApiCard(file="Notify")
</template>

<script>
export default {
  name: 'Index',

  meta: {
    title: 'Sample Page'
  }
}
</script>
