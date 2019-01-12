<template lang="pug">
doc-page(
  title="Introduction to Quasar Framework"
)
  div
    img(src="statics/img/responsive-logo.png")

  doc-section.h1(title="What is Quasar?")

  div Quasar (pronounced <doc-token>/ˈkweɪ.zɑɹ/</doc-token>) is an MIT licensed open-source Vue.js based framework, which allows you to <strong>write code once and simultaneously deploy it</strong> as a website, a Mobile App and/or an Electron App <strong>using the same codebase</strong>. It helps you develop an app in record time, by using a state of the art CLI and backed by well-written, very fast Quasar web components.

  doc-section.h1(title="Why Quasar?")

  div Because of the simplicity and power offered to you out of the box. Quasar, with its CLI, are chock full of features, all built to make your developer life easier. Below is a nonexaustive list of Quasar's great aspects and features.

  doc-section.h2(title="All Platforms in One Go")
  div One authoritative source of code for all platforms, simultaneously!
    ul
      li SPAs (Single Page App)
      li SSR (Server-side Rendered App) (+ optional PWA client takeover)
      li PWAs (Progressive Web App)
      li Mobile Apps (Android, iOS, …) through Apache Cordova
      li Multi-platform Desktop Apps (using Electron)

  doc-section.h2(title="One of the largest sets of Top Class, fast, and responsive web components")
  div There’s a component for almost every web development need within Quasar. Each of Quasar's components is carefully crafted to offer you the best possible experience for your users. Quasar is <strong>designed with performance & responsiveness in mind</strong> – so the overhead of using Quasar is barely noticeable. This attention to performance and good design is something we take special pride in.

  doc-section.h2(title="Best practices integrated by default")
  div Quasar was also built to encourage developers to follow web development best practices. To do this, Quasar is chock full of great features out of the box.
    ul
      li HTML/CSS/JS minification
      li Cache busting
      li Tree shaking
      li Sourcemapping
      li Code-splitting with lazy loading
      li ES6 transpiling
      li Linting code
      li Accessibility features

  div Quasar takes care of all these web develoment best parctices and more - <strong>with no configuration needed</strong>.

  doc-section.h2(title="Full RTL Support")
  div RTL (right to left) support for both Quasar components & the developer’s own code. Developer-written website/app CSS code gets automatically converted to RTL if an RTL language pack is used.

  doc-section.h2(title="Small yet powerful")
  div When using Quasar, you won’t need additional heavy libraries like Hammerjs, Momentjs or Bootstrap. It’s got those features covered and yet, still has a small footprint!

  doc-section.h2(title="Progressively migrate your existing project")
  div Quasar offers a UMD (Unified Module Definition) version, which means developers can add a CSS and JS HTML tag into their existing project and they’re ready to use it. No build step is required.

  doc-section.h2(title="Unparalleled developer experience through Quasar's CLI")
  div When using Quasar’s CLI, developers benefit from:
    ul
      li State preserving hot module reload (HMR) - when making changes to app source code, no matter if it’s a website, PWA, a Mobile App (directly on a phone or on an emulator) or an Electron app, developers can simply change their code and they can watch it get updated on the fly, without the need of any page refreshes.
      li State preserving compilation error overlay.
      li Lint-on-save with ESLint – if developers like linting their code only
      li ES6 code transpiling
      li Sourcemaps
      li Changing build options doesn’t require a manual reload of the dev server
      li And many more leading-edge developer tools and techniques

  doc-section.h2(title="Get up to speed fast")
  div The top-class project intitialization feature of the CLI makes getting started very easy for you, as a developer. You can get your idea to reality in record time. In other words, Quasar does the heavy lifting for you, so you are free to focus on your features and not on boilerplate.

  doc-section.h2(title="Awesome ever-growing community")
  div When developers encounter a problem they can’t solve, they can visit the Quasar forum or Discord chat server. The growing community is there to help you.

  doc-section.h2(title="Wide platform support")
  div Google Chrome, Firefox, IE11/Edge, Safari, Opera, iOS, Android, Windows Phone, Blackberry.

  doc-section.h2(title="Quasar Languages")
  div Internationalization is provided out of the box for Quasar components. If your desired Quasar language pack is missing, it takes just 5 minutes to add it.

  doc-section.h2(title="Great documentation")
  div Finally, it’s worth mentioning the significant amount of time that is spent on writing great, bloat-free, focused and complete documentation pages so that developers can quickly pick up Quasar. There will be no room for confusion.

  doc-section.h1(title="Underlying technologies")
  div
   doc-link(to="https://vuejs.org/") Vuejs
   doc-link(to="https://babeljs.io/") Babel
   doc-link(to="https://webpack.js.org/") Webpack
   doc-link(to="https://cordova.apache.org/") Cordova
   doc-link(to="https://electronjs.org/") Electron

  div Except for Vue, which takes half a day to pick up and will change you forever, there is no requirement for you to know the other technologies. They are all integrated and configured in Quasar for you.

  doc-section.h1(title="Get started in under a minute")
  div Having said this, let’s<doc-link to="/getting-started/pick-quasar-flavour">get started!</doc-link>. You’ll be running a website or app in under a minute.
</template>

<script>
export default {
  name: 'IntroductionToQuasarPage',

  meta: {
    title: 'Introduction to Quasar'
  }
}
</script>
