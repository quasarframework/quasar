<template lang="pug">
doc-page(
  title="Sample Page"
)
  div Introduction - <doc-token>token</doc-token>
  div
    | Introduction - another paragraph.
    doc-link.q-ml-xs(href="https://github.com/quasarframework/quasar", external) Bogus link
    | . Continuation...

  doc-section.h1(title="Header 1")
  div Bla bla bla

  doc-section.h2(title="Header 2")
  div Bla bla bla

  doc-section.h3(title="Header 3")
  div Bla bla bla

  div Warning sample
  doc-warning
    div Quasar is awesome
  doc-warning(title="IMPORTANT")
    div Quasar is awesome

  div Table sample
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

  div Code markup
  code-markup(lang="bash")
    | $ quasar dev -m ssr
    | # some comment
    | $ quasar build

  doc-section.h1(title="Installation")
  InstallationCard(
    components="QBtn"
    :plugins="['Meta', 'Cookies']"
    directives="Ripple"
    :config="{ notify: 'Notify' }"
  )

  doc-section.h1(title="Usage")
  code-example(title="Standard", file="QBtn/Standard")

  doc-section.h1(title="API")
  ApiCard(file="QUploader")
</template>

<script>
export default {
  name: 'NamePage',

  meta: {
    title: 'Name'
  }
}
</script>
