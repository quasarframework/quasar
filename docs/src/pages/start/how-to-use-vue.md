---
title: How To Use Vue
desc: Quick tutorial about Vue principles and how to use it with Quasar.
---
Before you begin with Quasar, it is a good idea to get acquainted with ES6 and have a fairly good knowledge about how Vue 3 works. ([Quick overview of ES6](https://github.com/lukehoban/es6features) and [ES6 complete list of features](http://es6-features.org/#Constants) -- don't worry, you don't need to understand ALL of ES6). For devs experienced with reactive UIs, the [Vue 3 documentation](https://v3.vuejs.org/) itself takes a half-day at most to read top-to-bottom and will help you understand how Quasar components can be used and configured.

::: tip
If you are a total beginner to Vue and reactive UI libraries and want a good tutorial, we recommend you take a look at [Vue and Quasar video tutorials](/video-tutorials).
:::

After reading the Vue documentation, let's clear up some of the most frequently asked questions, like *"How can I use Quasar components, Vue properties, methods and events"*.

## Vue Single File Components (SFC)

You'll be building your Quasar app using `*.vue` files which contain multiple sections: `template` (HTML), `script` (Javascript) and `style` (CSS/SASS/SCSS/Stylus/Less) all in the same file.

```html
<template>
  <!-- you define your Vue template here -->
</template>

<script>
// This is where your Javascript goes
// to define your Vue component, which
// can be a Layout, a Page or your own
// component used throughout the app.

export default {
  //
}
</script>

<style>
/* This is where your CSS goes */
</style>
```

### CSS preprocessors
For the `<style>` tag, you can also use whatever CSS preprocessor you want. [Sass/SCSS](https://sass-lang.com) (recommended) is available out of the box.

You can specify you want your chosen preprocessor to handle the CSS code that you're writing:

```html
<!-- notice lang="sass" -->
<style lang="sass">
.some-div
  font-size: 15px
</style>

<!-- notice lang="scss" -->
<style lang="scss">
.some-div {
  font-size: 15px;
}
</style>
```

## Using Quasar Directives

Quasar comes with a few custom [Vue Directives](https://v3.vuejs.org/guide/custom-directive.html). These directives can be applied on almost any DOM element or Component.

Example of a Quasar directive:

```html
<div v-ripple>Click Me</div>
```

> Notice how Ripple is used in the HTML template as `v-ripple`. Vue directives are prefixed with `v-`.

```html
<div v-touch-pan="handler">...</div>
<div v-touch-swipe="handler">...</div>
<div v-ripple>Click me. I got ripples.</div>
```

## Using Quasar Components
Quasar components have names beginning with "Q" like "QBtn" or "QElementResizeObserver". In order to use them, you need to add a reference to them in `/quasar.conf.js`.

Let's take the following example with a QBtn and QIcon and then we'll see how to embed these components in our app:

```html
<div>
  <q-btn @click="doSomething" label="Do something" />
  <q-icon name="alarm" />
</div>
```

> Notice how QBtn is used in the Vue HTML template as `<q-btn>`. If we'd import QElementResizeObserver, then we'd use it in template as `<q-element-resize-observer>`.

## Using Quasar Plugins
Quasar Plugins are features that you can use both in your Vue files as well as outside of them, like Notify, BottomSheet, AppVisibility and so on.

::: warning
**Before using them in your app**, you need to add a reference to them in `/quasar.conf.js` (as shown below).
:::

```js
framework: {
  plugins: [ 'Notify', 'BottomSheet' ]
}
```

Let's take Notify as an example and see how we can then use it. In a Vue file, you'd write something like this (Composition API):

```html
<template>
  <div>
    <q-btn
      @click="$q.notify('My message')"
      color="primary"
      label="Show a notification"
    />

    <q-btn
      @click="showNotification"
      color="primary"
      label="Show another notification"
    />
  </div>
</template>

<script>
import { useQuasar } from 'quasar'

export default {
  setup () {
    const $q = useQuasar()

    function showNotification () {
      $q.notify('Some other message')
    }

    return {
      showNotification
    }
  }
}
</script>
```

> Notice that in the template area we're using `$q.<plugin-name>`.

An equivalent script section in Options API:

```js
export default {
  methods: {
    showNotification () {
      this.$q.notify('Some other message')
    }
  }
}
```

Now let's see an example of Notify being used outside of a Vue file:

```js
import { Notify } from 'quasar'

// ...
Notify.create('My message')
```

### Self-Closing Tags

::: danger
Do NOT use self-closing tag form when you are using **Quasar UMD version**. Your browser is interpreting the HTML before Vue parses your DOM elements, so your HTML syntax must be correct. Unknown tags (like Vue components) cannot be self-closing because your browser will interpret those as if you are opening a tag but never closing it.
:::

Some Quasar components do not need you to include HTML content inside of them. In this case, you can use them as self-closing tags. One example with QIcon below:

```html
<q-icon name="cloud" />
```

Self-closing means the above template is the equivalent to:

```html
<q-icon name="cloud"></q-icon>
```

Both forms are valid and can be used, except for UMD where you must explicitly close the tags. It works the same with regular DOM elements:

```html
<div class="col" />
<!-- equivalent to: -->
<div class="col"></div>
```

Some eslint-plugin-vue linting rules actually enforce using the self-closing syntax.

## Handling Vue Properties
Let's take some examples with a bogus Quasar component (we will call it QBogus) that supports the properties below. We will discuss each of the types of Vue properties in the below sections.

| Vue Property | Type | Description |
| --- | --- | --- |
| `infinite` | Boolean | Infinite slides scrolling |
| `size` | String | Thickness of loading bar. |
| `speed` | Number | How fast should loading bar update its value (in milliseconds). |
| `columns` | Object | Object defining columns (see "Columns Definition" below). |
| `offset` | Array | Array with two numbers. Offset on horizontal and vertical (in pixels). |

### Boolean Property
A boolean property means it only accepts a strictly Boolean value. The values will not be cast to Boolean, so you must ensure you are using a true Boolean.

::: tip
In Quasar, all Boolean properties have `false` as the default value. As a result, you don't have to explictly assign them the `false` value.
:::

If you are trying to control that property and change it dynamically at runtime, then bind it to a variable in your scope:

```html
<template>
  <q-bogus :infinite="myInfiniteVariable" />
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const myInfiniteVariable = ref(false)
    return {
      myInfiniteVariable
    }
  }
}
</script>
```

If, on the other hand, you know this Boolean value is not going to change, you can use the shorthand version of the variable like a component attribute and just specify it. In other words, if you don't bind the variable to a variable in the component's scope as it will always be `true`:

```html
<template>
  <q-bogus infinite />

  <!--
    the following is perfectly valid,
    but it's a longer version
  -->
  <q-bogus :infinite="true" />
</template>
```

### String Property
As you can imagine, Strings are required as a value for this type of property.

```html
<template>
  <!--
    direct assignment, no need for
    a variable in our scope
  -->
  <q-bogus size="24px" />

  <!--
    we can also bind it to a variable
    in our scope so we can dynamically
    change it
  -->
  <q-bogus :size="mySize" />
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    // notice String as value
    const mySize = ref('16px')
    return {
      mySize
    }
  }
}
</script>
```

### Number Property

```html
<template>
  <!--
    Case 1. Direct assignment.
    Notice the colon (":") before property name.
  -->
  <q-bogus :speed="50" />

  <!-- Case 2. Assignment through a scope variable -->
  <q-bogus :speed="myNumber" />
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    // notice Number as value
    const myNumber = ref(50)
    return {
      myNumber
    }
  }
}
</script>
```

### Object Property

```html
<template>
  <!-- Case 1. Direct assignment. -->
  <q-bogus :columns="{key: 'value', anotherKey: 'another value'}" />
  <!-- or a more elegant way for Case 1: -->
  <q-bogus
    :columns="{
      key: 'value',
      anotherKey: 'another value'
    }"
  />

  <!-- Case 2. Assignment through a scope variable -->
  <q-bogus :columns="myColumns" />
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const myColumns = ref({
      key: 'value',
      anotherKey: 'another value'
    })

    return { myColumns }
  }
}
</script>
```

### Array Property

```html
<template>
  <!-- Case 1. Direct assignment. -->
  <q-bogus :offset="[10, 20]" />

  <!-- Case 2. Assignment through a scope variable -->
  <q-bogus :offset="myOffset" />
</template>

<script>
export default {
  setup () {
    return {
      myOffset: [10, 20]
    }
  }
}
</script>
```

## Handling Vue Methods
You will notice throughout the documentation that some Quasar components have methods that can be called. Example:

| Vue Method | Description |
| --- | --- |
| `next()` | Goes to next slide. |
| `previous(doneFn)` | Goes to previous slide. |
| `toggleFullscreen()` | Toggles fullscreen mode. |

In order for you to access these methods, you will need to set a Vue reference on the component first. Here's an example with Composition API:

```html
<template>
  <!--
    Notice ref="myRef". We will use the name
    assigned to "ref" in the script part below
  -->
  <q-bogus ref="myRef" />
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup () {
    const myRef = ref(null)

    // after the component has mounted into DOM:
    onMounted(() => {
      // we call "next()" method of our component
      myRef.value.next()
    })
    // calling before mount point might result in errors
    // as Vue hasn't yet prepared the Vue reference

    // we expose myRef to the scope so Vue
    // can use it in the template as well
    return { myRef }
  }
}
</script>
```

And here is the same example, but with Options API:

```html
<template>
  <!--
    Notice ref="myRef". We will use the name
    assigned to "ref" in the script part below
  -->
  <q-bogus ref="myRef" />
</template>

<script>
export default {
  // we can now access `this.$refs.myRef`
  // an example on the mounted() Vue component hook
  mounted () {
    // calling "next()" method:
    this.$refs.myRef.next()
  }
  // calling before mount point might result in errors
  // as Vue hasn't yet prepared the Vue reference
}
</script>
```

## Handling Vue Events
You will notice throughout the documentation that some Quasar components have a section called "Vue Events".

Example of "Vue Events":

| Event Name | Description |
| --- | --- |
| `@show` | Triggered right after the Modal is shown. |
| `@hide` | Triggered right after the Modal is hidden. |

In order for you to catch these events, when they are triggered, you will need to add listeners for them on the component itself in the HTML template. Here's an example:

```html
<template>
  <q-bogus @show="doSomething" @hide="doSomethingElse" />
</template>

<script>
export default {
  setup () {
    function doSomething () {
      // this method has been called (in this case)
      // because @show event was triggered by QBogus component
    }

    function doSomethingElse () {
      // this method has been called (in this case)
      // because @hide event was triggered by QBogus component
    }

    return {
      doSomething,
      doSomethingElse
    }
  }
}
</script>
```
