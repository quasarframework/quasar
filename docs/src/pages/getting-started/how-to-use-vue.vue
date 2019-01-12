<template lang="pug">
doc-page(
  title="How to use Vue"
)
  div Before you begin with Quasar, it is a good idea to get acquainted with ES6 and have a fairly good knowledge about how Vue works (<doc-link to="https://github.com/lukehoban/es6features">Quick overview of ES6</doc-link> and <doc-link to="http://es6-features.org/#Constants">full description</doc-link> – don’t worry, you don’t need to understand ALL of ES6). For devs experienced with reactive UIs, the <doc-link to="https://vuejs.org/v2/guide/">Vue documentation</doc-link> itself takes half a day at most to read top-to-bottom and will help you understand how Quasar components can be used and configured.

  div If you are a total beginner to Vue and reactive UI libraries and want a good tutorial, we recommend you take a look at the <doc-link to="https://www.udemy.com/vuejs-2-the-complete-guide/learn/v4/overview">Udemy Course - Vue JS 2 - The Complete Guide</doc-link>.

  div After reading the Vue documentation, let’s clear up some of the most frequently asked questions, like “How can I use Quasar components, Vue properties, methods and events”.

  doc-section.h1(title="Single File Vue Components")

  div You’ll be building your Quasar app using <doc-token>*.vue</doc-token> files which contain multiple sections: ‘template’ (HTML), ‘script’ (Javascript) and ‘style’ (CSS).
  code-markup(lang="html") {{ markup.sfc }}

  doc-section.h2(title="CSS preprocessors")

  div For the <doc-token>style</doc-token> tag, you can also use whatever CSS preprocessor you want. <doc-link to="http://stylus-lang.com/">Stylus</doc-link> is available out of the box. For SCSS/SASS or LESS, you’ll need to install their Webpack loaders (examples: <doc-token>yarn add --dev less-loader</doc-token> or <doc-token>npm install --save-dev less-loader</doc-token>)

  div After installing the loader you need (remember Stylus is already installed for you), you can specify you want your chosen preprocessor to handle the CSS code you’re writing:

  code-markup(lang="html") {{ markup.sfcStyle }}

  div In the above example, you would replace <doc-token>stylus</doc-token> with the preprocessor you’ve chosen.

  doc-section.h1(title="Using Quasar Directive")

  div Quasar comes with custom <doc-link to="https://vuejs.org/v2/guide/custom-directive.html">Vue Directives</doc-link>. These directives can be applied on almost any DOM element or Component.

  div Example of a Quasar directive:
  code-markup(lang="html") {{ markup.directive }}

  doc-note
    | Notice how Ripple is used in the HTML template as <doc-token>v-ripple</doc-token>. Vue directives are prefixed with <doc-token>v-</doc-token>.

  div In order for you to use any of the directives that Quasar supplies, you first need to tell Quasar you want it embedded. Open <doc-token>/quasar.conf.js</doc-token> file and add the following reference:

  code-markup
    | framework: {
    |   directives: ['Ripple']
    | }

  div Let’s take another example. We now also want TouchPan and TouchSwipe directives, so we add them too in <doc-token>/quasar.conf.js</doc-token>:

  code-markup
    | framework: {
    |   directives: ['Ripple', 'TouchPan', 'TouchSwipe']
    | }

  div Now we can write in your Vue files template:
  code-markup(lang="html") {{ markup.directiveLast }}

  doc-section.h1(title="Using Quasar Components")
  div Quasar components have names beginning with “Q” like “QBtn” or “QElementResizeObservable”. In order to use them, you need to add a reference to them in <doc-token>/quasar.conf.js</doc-token>.

  div Let’s take the following example with a QBtn and QIcon and then we’ll see how to embed these components in our app:
  code-markup(lang="html") {{ markup.component }}

  doc-note
    | Notice how QBtn is used in the Vue HTML template as <doc-token>q-btn</doc-token>. If we’d import QElementResizeObserver, then we’d use it in template as <doc-token>q-element-resize-observer</doc-token>

  div Now on <doc-token>/quasar.conf.js</doc-token>, you would add:
  code-markup
    | framework: {
    |   components: ['QBtn', 'QIcon']
    | }

  doc-section.h1(title="Using Quasar Plugins")

  div Quasar Plugins are features that you can use both in your Vue files as well as outside of them, like Notify, ActionSheet, AppVisibility and so on.

  div In order to use them, you need to add a reference to them in <doc-token>/quasar.conf.js</doc-token>:
  code-markup
    | framework: {
    |   plugins: ['Notify', 'ActionSheet']
    | }

  div Let’s take Notify as an example and see how we can then use it. In a Vue file, you’d write something like this:
  code-markup(lang="html") {{ markup.notify }}

  doc-note
    | Notice that in the template area we’re using <doc-token>$q.[plugin-name]</doc-token> and in our script we say <doc-token>this.$q.[plugin-name]</doc-token>.

  div Now let’s see an example of Notify being used outside of a Vue file:
  code-markup
    | import { Notify } from 'quasar'
    |
    | // ...
    | Notify.create('My message')

  doc-section.h2(title="Importing All Components and Directives for Quick Test")
  div Referencing all Quasar Components, Directives and Plugins can be tiresome when you just want to do a quick test. In this case, you can tell Quasar to import them all by editing <doc-token>/quasar.conf.js</doc-token> like this:
  code-markup framework: 'all'
  doc-note(title="IMPORTANT")
    | This <strong>will not</strong> take advantage of tree shaking, causing your bundle to become bloated with unnescesary/unused code. <strong>Not recommended for production</strong>. Use this only for quick testing purposes.
</template>

<script>
import sfc from '!raw-loader!markup/sfc.html'
import sfcStyle from '!raw-loader!markup/sfc-style.html'
import notify from '!raw-loader!markup/notify.html'

export default {
  name: 'HowToPage',

  meta: {
    title: 'How to use Vue'
  },

  created () {
    this.markup = {
      sfc,
      sfcStyle,
      directive: `<div v-ripple>Click Me</div>`,
      directiveLast: `<div v-touch-pan="handler">...</div>
<div v-touch-swipe="handler">...</div>
<div v-ripple>Click me. I got ripples.</div>`,
      component: `<div>
  <q-btn @click="doSomething">Do something</q-btn>
  <q-icon name="alarm" />
</div>`,
      notify
    }
  }
}
</script>
