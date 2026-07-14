---
title: SEO for SSG
desc: (@quasar/app-vite) Managing the search engine optimizations in a Quasar SSG app.
---

::: warning Warning! Beta Stage
The Quasar SSG Mode is currently in the "beta" stage. Based on the community feedback, the API may change in the future, so check the release notes each time you upgrade "@quasar/app-vite".
:::

SSG gives crawlers rendered HTML, but each generated route still needs an accurate title, description, canonical URL, and social-sharing metadata. Use the [Quasar Meta Plugin](/quasar-plugins/meta) from the page component so those values are included during the build.

## Quasar Meta Plugin

The [Quasar Meta Plugin](/quasar-plugins/meta) can change the page title, manage `<meta>` tags, set attributes on the `<html>` and `<body>` elements, add or update `<style>` and `<script>` tags in the document head, and manage `<noscript>` tags. This includes structured data such as JSON-LD.

::: tip
The Meta Plugin is integrated with Quasar's rendering pipeline, so metadata declared while an SSG page is rendered is included in the generated HTML.
:::

For example, an article page can provide its title, description, Open Graph fields, and canonical URL:

```html /src/pages/ArticlePage.vue
<script setup>
  import { useMeta } from 'quasar'

  const article = {
    title: 'Choosing a rendering mode',
    description: 'Compare SPA, SSR, and SSG for a Quasar application.',
    url: 'https://example.com/guides/rendering-modes'
  }

  useMeta({
    title: article.title,
    meta: {
      description: {
        name: 'description',
        content: article.description
      },
      ogTitle: {
        property: 'og:title',
        content: article.title
      },
      ogDescription: {
        property: 'og:description',
        content: article.description
      }
    },
    link: {
      canonical: {
        rel: 'canonical',
        href: article.url
      }
    }
  })
</script>
```

Data used to create build-time metadata must be available while the page is rendered. If metadata is fetched only after hydration, it will not be present in the generated HTML.

Also generate and deploy a `robots.txt` file and sitemap when the site needs them. These are site-level files and are not generated automatically from the SSG page list.
