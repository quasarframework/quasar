<template lang="pug">
doc-page(
  title="Introduction to the Quasar Framework"
)
  div
    img(src="statics/img/responsive-logo.png")

  doc-section.h1(title="What is Quasar?")

  div Quasar (pronounced /ˈkweɪ.zɑɹ/) is an MIT licensed open-source framework (powered with Vue) that helps web developers create responsive++ websites/apps in many flavours:

  ul
    li SPAs (Single Page App)
    li SSR (Server-side Rendered App) (+ optional PWA client takeover)
    li PWAs (Progressive Web App)
    li Mobile Apps (Android, iOS, …) through Apache Cordova
    li Multi-platform Desktop Apps (using Electron)

  div <strong>Quasar allows developers to write code once and simultaneously deploy</strong> as website (SPA, PWA, SSR + SPA client takeover, SSR + PWA client takeover), Mobile App and/or Electron App <strong>using the same codebase</strong>. Design an app in record time, using a state of the art CLI and backed by well-written, very fast Quasar web components.

  div When using Quasar, you won’t need additional heavy libraries like Hammerjs, Momentjs or Bootstrap. It’s got that covered too, and with a small footprint!

  doc-section.h1(title="Why Quasar?")

  div Because of what is offered out of the box. Follow our <doc-link to="https://twitter.com/quasarframework">Twitter</doc-link> account for testimonials (and news).

  doc-section.h2(title="All Platforms in One Go")
  div One authoritative source of code for all platforms, simultaneously: responsive desktop/mobile websites (SPA, SSR + SPA client takeover, SSR + PWA client takeover), PWAs (Progressive Web Apps), mobile apps (that look native) and multi-platform desktop apps (through Electron).

  doc-section.h2(title="Top Class, fast web responsive components")
  div There’s a component for almost every web development need out there. Each of these components is carefully crafted to offer the best possible experience to users. Quasar is <strong>designed with performance & responsiveness in mind</strong> – so the overhead of using Quasar is barely noticeable. This is an area we take special pride in.

  doc-section.h2(title="Best practices integrated by default")
  div Developers using Quasar are encouraged to follow web development best practices, and it comes embedded with many such features out of the box. HTML/CSS/JS minification, cache busting, tree shaking, sourcemapping, code-splitting & lazy loading, ES6 transpiling, linting code, accessibility features. Quasar takes care of all these and more - no configuration needed.

  doc-section.h2(title="Full RTL Support")
  div RTL (right to left) support for both Quasar components & the developer’s own code. Developer-written website/app CSS code gets automatically converted to RTL if an RTL language pack is used.

  doc-section.h2(title="Progressively migrate your existing project")
  div Quasar offers a UMD (Unified Module Definition) version, which means developers can add a CSS and JS HTML tag into their existing project and they’re ready to use it. No build step is required.

  doc-section.h2(title="Unparalleled developer experience through Quasar CLI")
  div When using Quasar’s CLI, developers benefit from:
  ul
    li State preserving hot-reload when making changes to app source code, no matter if it’s a website, PWA, a Mobile App (directly on a phone or on an emulator) or an Electron app. Developers simply change their code and they can watch it get updated on the fly, without the need of any page refresh.
    li State preserving compilation error overlay.
    li Lint-on-save with ESLint – if developers like linting their code only
    li ES6 code transpiling
    li Sourcemaps
    li Changing build options doesn’t require a manual reload of the dev server
    li Many more leading-edge developer tools and techniques

  doc-section.h2(title="Get up to speed fast")
  div The top-class project intitialization feature of the CLI makes getting started very easy for you, as a developer. You can get your idea to reality in record time. In other words, Quasar does the heavy lifting for you, so you are free to focus on your features and not on boilerplate.

  doc-section.h2(title="Awesome ever-growing community")
  div When developers encounter a problem they can’t solve, they can visit the Quasar forum or Discord chat server. The community is there to help you.

  doc-section.h2(title="Wide platform support")
  div Google Chrome, Firefox, IE11/Edge, Safari, Opera, iOS, Android, Windows Phone, Blackberry.

  doc-section.h2(title="Quasar Languages")
  div Internationalization is provided out of the box for Quasar components. If your desired Quasar language pack is missing it takes just 5 minutes to add it.

  doc-section.h2(title="Great documentation")
  div Finally, it’s worth mentioning the significant amount of time that is spent on writing great, bloat-free, focused, complete documentation pages so that developers can quickly pick up Quasar. There will be no room for confusion.

  doc-section.h1(title="Underlying technologies")
  div
    doc-link(to="https://vuejs.org/") Vuejs
    doc-link(to="https://babeljs.io/") Babel
    doc-link(to="https://webpack.js.org/") Webpack
    doc-link(to="https://cordova.apache.org/") Cordova
    doc-link(to="https://electronjs.org/") Electron
  div Except for Vue, which takes half a day to pick up and will change you forever, you are not really required to know the other technologies. Most of them are integrated and already configured for you.

  doc-section.h1(title="Get started in under a minute")
  div Having said this, let’s <doc-link to="/getting-started/pick-quasar-flavour">get started!</doc-link>. You’ll be running a website or app in under a minute.
</template>

<script>
export default {
  name: 'NamePage',

  meta: {
    title: 'Name'
  }
}
</script>
