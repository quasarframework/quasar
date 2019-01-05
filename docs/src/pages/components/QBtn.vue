<template lang="pug">
q-page(padding)
  div#introduction
    h1.q-mt-none.q-mb-xl QBtn
    p Quasar has a component called QBtn which is a button with a few extra useful features. For instance, it comes in two shapes: rectangle (default) and round. It also has the material ripple effect by default when building with Material theme.
    p The button component also comes with a spinner or loading effect. You would use this for times when app execution may cause a delay and you want to give the user some feedback about that delay. When used, the button will display a spinning animation as soon as the user clicks the button.
    p When not disabled or spinning, QBtn emits a @click event, as soon as it is clicked or tapped.

  p Some code markup
  code-markup(lang="bash")
    | $ quasar dev -m ssr
    | # some comment
    | $ quasar build

  div text, more text, a <q-chip small square>token</q-chip>, some more text.

  q-markup-table.q-mb-lg
    thead
      tr
        th Property
        th Type
        th Description
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

  h2#installation Installation
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

  h2#usage Usage
  code-example(title="Standard", file="QBtn/Standard")

  p Quasar has a component called QBtn which is a button with a few extra useful features. For instance, it comes in two shapes: rectangle (default) and round. It also has the material ripple effect by default when building with Material theme.

  p The button component also comes with a spinner or loading effect. You would use this for times when app execution may cause a delay and you want to give the user some feedback about that delay. When used, the button will display a spinning animation as soon as the user clicks the button.

  p When not disabled or spinning, QBtn emits a @click event, as soon as it is clicked or tapped.

  h2#api API
  ApiCard(:file="QBtn")
</template>

<script>
export default {
  name: 'Button',

  meta: {
    title: 'QBtn'
  }
}
</script>
