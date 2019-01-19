---
title: Adding Pages and Layouts
---
Your Pages (`/src/pages`) and Layouts (`/src/layouts`) are injected into your website/app (and also managed) through Vue Router in `/src/router/routes.js`. Each Page and Layout needs to be referenced there.

::: tip
You may want to read [Routing](/quasar-cli/cli-documentation/routing) first and also understand [Lazy Loading / Code Splitting](/quasar-cli/cli-documentation/lazy-loading).
:::

## Defining Routes

Example of `routes.js`:
```js
// we define our routes in this file

import LandingPage from 'pages/Landing'

const routes = [
  {
    path: '/',
    component: LandingPage
  }
]

export default routes
```

Example of `routes.js` using lazy-loading / on-demand loading:
```js
// we define our routes in this file

const routes = [
  {
    path: '/',
    component: () => import('pages/Landing')
  }
]

export default routes
```

::: warning
Configuring routes to use Layouts and Pages basically consists of correctly nesting routes, as we'll see in the next section.
:::

## Nested Routes
Real app UIs are usually composed of components that are nested multiple levels deep. It is also very common that the segments of a URL corresponds to a certain structure of nested components, for example:

```
/user/profile                   /user/posts
+------------------+            +-----------------+
| User             |            | User            |
| +--------------+ |            | +-------------+ |
| | Profile      | |  +------>  | | Posts       | |
| |              | |            | |             | |
| +--------------+ |            | +-------------+ |
+------------------+            +-----------------+
```

With Vue Router, it is very simple to express this relationship using nested route configurations. We notice some things: both pages need to be wrapped by a User component. Hey, User component is then a Layout!

Let's create these files:
```bash
$ quasar new layout User
 app:new Generated layout: src/layouts/User.vue +0ms
 app:new Make sure to reference it in src/router/routes.js +2ms

$ quasar new page Profile Posts
 app:new Generated page: src/pages/Profile.vue +0ms
 app:new Make sure to reference it in src/router/routes.js +2ms

 app:new Generated page: src/pages/Posts.vue +1ms
 app:new Make sure to reference it in src/router/routes.js +0ms
```

Since User layout wraps inner pages, they need an injection point. This is supplied by the `<router-view>` component:
```html
<!-- /src/layouts/User.vue -->
<template>
  <q-layout>
    ...

    <!-- this is where the Pages are injected -->
    <q-page-container>
      <router-view></router-view>
    </q-page-container>

    ...
  </q-layout>
</template>
```

```html
<!-- /src/pages/Profile.vue or Posts.vue -->
<template>
  <q-page>
    ...page content...
  </q-page>
</template>
````

Our example has some routes specified (/user/profile and /user/posts). **So how can we put everything together now?** We edit the routes file. That's where we will configure routes, tell which components are Layouts and which are Pages and also reference/import them into our app:

```js
// src/router/routes.js

import User from 'layouts/User'
import Profile from 'pages/Profile'
import Posts from 'pages/Posts'

const routes = [
  {
    path: '/user',

    // we use /src/layouts/User component which is imported above
    component: User,

    // hey, it has children routes and User has <router-view> in it;
    // It is really a Layout then!
    children: [
      // Profile page
      {
        path: 'profile', // here it is, route /user/profile
        component: Profile // we reference /src/pages/Profile.vue imported above
      },

      // Posts page
      {
        path: 'posts', // here it is, route /user/posts
        component: Posts // we reference /src/pages/Posts.vue imported above
      }
    ]
  }
]

export default routes
```

::: warning
Note that nested paths that start with `/` will be treated as a root path. This allows you to leverage component nesting without having to use a nested URL.
:::

::: tip
For further in-detail reading please take a look on [Vue Router](https://router.vuejs.org/en/essentials/nested-routes.html#) documentation.
:::
