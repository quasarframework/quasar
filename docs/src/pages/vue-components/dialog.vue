<template lang="pug">
doc-page(
  title="Dialog"
)

  div Quasar Dialogs are a great way to offer the user the ability to choose a specific action or list of actions. They also can provide the user with important information, or require them to make a decision (or multiple decisions).

  div From a UI perspective, you can think of Dialogs as a type of floating modal, which covers only a portion of the screen. This means Dialogs should only be used for quick user actions, like verifying a password, getting a short App notification or selecting an option or options quickly. For more in depth user interactions, you should use QModal (add link to QModal).

  doc-note(title="Note")
    div Dialogs can be used either as a component in your Vue file templates (for complex use-cases, like specific form components with validation, selectable options, etc.), or they can be used as a globally available method for more basic use cases, like the native JS alert(), prompt(), etc.

  doc-note(title="IMPORTANT")
   div When the user hits the phone/tablet back button (only for Cordova apps), the Dialog will be closed automatically.
   div Also, when on a desktop browser, hitting the <doc-token>ESCAPE</doc-token> key will also close the Dialog, as does clicking or touching outside of the Dialog.

  doc-section.h1(title="Installation as a Plugin")
  InstallationCard(
    plugins="QDialog"
  )

  doc-section.h1(title="Usage as a Plugin")
  code-example(title="Examples", file="QDialog/Plugin")

  doc-section.h1(title="Installation as a Component")
  InstallationCard(
    components="QDialog"
  )

  doc-section.h1(title="Usage as a Component")
  code-example(title="Examples", file="QDialog/Component")

  doc-section.h1(title="API")
  ApiCard(file="QDialog")

  div.
    Introduction - another paragraph.
    <doc-link to="https://github.com/quasarframework/quasar">External link</doc-link>.
    Continuation... <doc-link to="/sponsors-and-backers">Internal link</doc-link> ...

  doc-section.h1(title="Header 1")
  div Bla bla bla

  doc-section.h2(title="Header 2")
  div Bla bla bla

  doc-section.h3(title="Header 3")
  div Bla bla bla

  div Warning sample
  doc-note
    div Quasar is awesome
  doc-note(title="IMPORTANT")
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
  name: 'QDialog',

  meta: {
    title: 'QDialog'
  }
}
</script>
