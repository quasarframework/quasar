---
title: Quasar Meta Plugin
desc: A Quasar plugin to easily handle the meta tags of an app, helping you to add SEO. It manages meta, style and script tags, html and body attributes and page titles.
keys: Meta
related:
  - /vue-composables/use-meta
---

**Better SEO for your website!** The Meta plugin can dynamically change page title, manage `<meta>` tags, manage `<html>` and `<body>` DOM element attributes, add/remove/change `<style>` and `<script>` tags in the head of your document (useful for CDN stylesheets or for json-ld markup, for example), or manage `<noscript>` tags.

::: tip
Take full advantage of this feature by using it with **Quasar CLI**, especially **for the SSR (Server-Side Rendering) builds**. It also makes sense to use it for SPA (Single Page Applications). Although the meta information in this case will be added at run-time and not supplied directly by the webserver (as on SSR builds), modern web-crawlers like the [Googlebot](https://developers.google.com/search/docs/guides/javascript-seo-basics) will render dynamic pages and extract out the dynamically set meta information.
:::

## Installation

<doc-installation plugins="Meta" />

## Usage
What the Meta plugin does is that it enables the use of a special property in your Vue components called `meta`. Take a look at the example below, with almost all of its features:

### Composition API

We will be using the [useMeta](/vue-composables/use-meta) composable.

```js
// some .vue file
import { useMeta } from 'quasar'

const metaData = {
  // sets document title
  title: 'Index Page',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: title => `${title} - My Website`,

  // meta tags
  meta: {
    description: { name: 'description', content: 'Page 1' },
    keywords: { name: 'keywords', content: 'Quasar website' },
    equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' },
    // note: for Open Graph type metadata you will need to use SSR, to ensure page is rendered by the server
    ogTitle:  {
      property: 'og:title',
      // optional; similar to titleTemplate, but allows templating with other meta properties
      template (ogTitle) {
        return `${ogTitle} - My Website`
      }
    }
  },

  // CSS tags
  link: {
    material: { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }
  },

  // JS tags
  script: {
    ldJson: {
      type: 'application/ld+json',
      innerHTML: `{ "@context": "http://schema.org" }`
    }
  },

  // <html> attributes
  htmlAttr: {
    'xmlns:cc': 'http://creativecommons.org/ns#', // generates <html xmlns:cc="http://creativecommons.org/ns#">,
    empty: undefined // generates <html empty>
  },

  // <body> attributes
  bodyAttr: {
    'action-scope': 'xyz', // generates <body action-scope="xyz">
    empty: undefined // generates <body empty>
  },

  // <noscript> tags
  noscript: {
    default: 'This is content for browsers with no JS (or disabled JS)'
  }
}

export default {
  setup () {
    // needs to be called in setup()
    useMeta(metaData)
  }
}
```

If you depend on the state of the component to compute the meta Object, then you can supply a Function instead of the Object itself. For more information, check the "Reactive" section on this page.

### Options API

```js
// some .vue file
import { createMetaMixin } from 'quasar'

const metaData = {
  // sets document title
  title: 'Index Page',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: title => `${title} - My Website`,

  // meta tags
  meta: {
    description: { name: 'description', content: 'Page 1' },
    keywords: { name: 'keywords', content: 'Quasar website' },
    equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' },
    // note: for Open Graph type metadata you will need to use SSR, to ensure page is rendered by the server
    ogTitle:  {
      property: 'og:title',
      // optional; similar to titleTemplate, but allows templating with other meta properties
      template (ogTitle) {
        return `${ogTitle} - My Website`
      }
    }
  },

  // CSS tags
  link: {
    material: { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }
  },

  // JS tags
  script: {
    ldJson: {
      type: 'application/ld+json',
      innerHTML: `{ "@context": "http://schema.org" }`
    }
  },

  // <html> attributes
  htmlAttr: {
    'xmlns:cc': 'http://creativecommons.org/ns#' // generates <html xmlns:cc="http://creativecommons.org/ns#">,
    empty: undefined // generates <html empty>
  },

  // <body> attributes
  bodyAttr: {
    'action-scope': 'xyz', // generates <body action-scope="xyz">
    empty: undefined // generates <body empty>
  },

  // <noscript> tags
  noscript: {
    default: 'This is content for browsers with no JS (or disabled JS)'
  }
}

export default {
  mixins: [
    createMetaMixin(metaData)
  ]
}
```

For the Options API approach, if you depend on the state of the component to compute the meta Object, then you can supply a Function instead of the Object itself:

```js
export default {
  mixins: [
    createMetaMixin(function () {
      // "this" here refers to your component
      return {
        // assuming `this.myTitle` exists in your mixed in component
        title: this.myTitle
      }
    })
  ]
}
```

## How It Works
Metas are computed from .vue files in the order their vue components are activated by Vue Router (let’s call this a chain for further explanations). Example: App.vue > SomeLayout.vue > IndexPage.vue > …?

When a component that uses Meta plugin gets rendered or destroyed, it is added/removed to/from the chain and metas are updated accordingly.

### Non-reactive

Notice that all properties (except for title and titleTemplate) are Objects; you can override meta props defined in previous Vue components in the chain by using the same keys again. Example:

```js
// first loaded Vue component
setup () {
  useMeta({
    meta: {
      myKey: { name: 'description', content: 'My Website' }
    }
  })
}

// a subsequent Vue component in the chain;
// this will override the first definition on "myKey"
setup () {
  useMeta({
    meta: {
      myKey: { name: 'description', content: 'Page 1' }
    }
  })
}
```

::: warning
Just make sure not to duplicate content that already exists in `/src/index.template.html`. If you want to use the Meta plugin, the recommended way is to remove the same tags from the html template. But on use-cases where you know a tag will never change and you always want it rendered, then it's better to have it only on the html template instead.
:::

### Reactive

In the section above, you noticed all of the meta props are "static". But they can be dynamic (reactive) instead, should you wish. This is how you can manage them just as with a Vue computed property:

```js
// some .vue file
import { useMeta } from 'quasar'
import { ref } from 'vue'

export default {
  setup () {
    const title = ref('Some title') // we define the "title" prop

    // NOTICE the parameter here is a function
    // Under the covers, it is converted to a Vue computed prop for reactivity
    useMeta(() => {
      return {
        // whenever "title" from above changes, your meta will automatically update
        title: title.value
      }
    })

    function setAnotherTitle () {
      title.value = 'Another title' // will automatically trigger a Meta update due to the binding
    }

    return {
      setAnotherTitle
    }
  }
}
```

## Testing Meta
Before you deploy, you really should make sure that your work on the meta tags is compliant. Although you could just copy and paste your link into a Discord chat, a Facebook post or a Tweet, we recommend verifying with [https://metatags.io/](https://metatags.io/).
