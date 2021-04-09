---
title: RTL Support
desc: Right to left support in a Quasar app.
related:
  - /options/quasar-language-packs
  - /options/app-internationalization
---
RTL is referring to "right to left" UI for languages that need it.

## Enabling RTL support
To enable it, you need to edit `/quasar.conf.js`:
```js
build: {
  rtl: true
}
```

## How it works
RTL is tightly coupled to [Quasar Language Packs](/options/quasar-language-packs). **When Quasar is set to use an RTL language** (language pack has "rtl" prop set to "true") and **RTL support is enabled** (check step above for quasar.conf.js), then the UI will dynamically transform Quasar & your website/app code for RTL.

Let's discuss about each of these requirements:

1. *Quasar needs to be set to use an RTL language*.
  See [Quasar Language Packs](/options/quasar-language-packs) on how you can set a language. You can set a language as default or dynamically set one.

2. *RTL support needs to be enabled*.
  You need to set "rtl" to "true" under quasar.conf.js > "build". What this does is it compiles CSS for both your website/app code and for Quasar components and add corresponding RTL CSS rules automatically. Your CSS bundle will slightly increase in size due to the addition of these CSS rules.

3. Optional: *Enable fromRTL flag*.
  By default, Quasar assumes that all styles are written in LTR direction and generates corresponding RTL styles for them. Should you wish to write your own css directly in RTL then you need to set quasar.conf.js > "build" > rtl > "fromRTL" to `true`.

## Things to keep in mind
* Both RTL and non-RTL Quasar language packs will work together and dynamically switch to/from RTL. So only choosing an RTL Quasar language pack will trigger the RTL UI for you. You don't need separate builds of your app (one for non-RTL and one for RTL-only). The RTL is dynamically changed for you automatically.
* You can dynamically detect if you are on RTL mode by taking a look at Boolean `this.$q.lang.rtl`. More info on [Vue Prototype Injections](/options/vue-prototype-injections).
* You need to be careful when writing your own CSS. Like mentioned above, Quasar will automatically add RTL (LTR if quasar.conf.js > build > rtl > fromRTL is set to true) rules based on your CSS code. So writing:

```css
.my-class {
  margin-left: 10px;
  right: 5px;
}
```

  ...will add this rule for RTL:

```css
[dir=rtl] .my-class {
  margin-right: 10px;
  left: 5px;
}
```

  Any CSS rule that refers to "left" or "right" is automatically triggering an equivalent RTL CSS rule to be added.

### Marking CSS rules as exceptions
If you need an exception so your CSS code will not add a corresponding RTL rule, then add this comment:

```css
.my-class {
  margin-left: 10px /* rtl:ignore */;
}
```

...or, if you are using Stylus:

```css
.my-class
  margin-left 10px /* rtl:ignore */
```

...or SCSS with indented form:

```css
.my-class
  margin-left: 10px #{"/* rtl:ignore */"}
```

...or default SCSS:

```css
.my-class {
  margin-left: 10px #{"/* rtl:ignore */"};
}
```

Now both RTL and non-RTL UI mode will have `margin-left` prop.

Sometimes you'll need to make exceptions for whole DOM elements / components. In this case, add `dir="ltr"` or `dir="rtl"` HTML attribute to the outermost DOM element / component template:

```html
<div dir="rtl">
  <!--
    this DIV and all its content will use RTL mode
    regardless of Quasar language pack RTL settings
  -->
</div>
```

Or, if you need your RTL UI to use left-to-right (ltr) mode for a DOM element / component:
```html
<div dir="ltr">
  <!--
    this DIV and all its content will use non-RTL mode
    regardless of Quasar language pack RTL settings
  -->
</div>
```

## Handling Quasar UMD
To enable RTL UIs in UMD you need to include the RTL equivalent CSS tag for your Quasar version and also pack in a Quasar RTL language pack (like Hebrew or Farsi). Example:

```html
<html>
  <head>
    ...
    <!-- Replace "1.0.0" (below) with your Quasar version. -->
    <link href="https://cdn.jsdelivr.net/npm/quasar@^1.0.0/dist/quasar.rtl.min.css" rel="stylesheet" type="text/css">
  </head>

  <body>
    ...

    <!--
      We also need an RTL Quasar language pack; let's take Hebrew as an example;
      include this after Quasar JS tag;
      Replace "1.0.0" (below) with your Quasar version.
    -->
    <script src="https://cdn.jsdelivr.net/npm/quasar@^1.0.0/dist/lang/he.umd.min.js"></script>
    <script>
      Quasar.lang.set(Quasar.lang.he)
    </script>
  </body>
</html>
```

Check what tags you need to include in your HTML files by using our [UMD tag generator](/start/umd) and making sure that you tick the "RTL CSS support" checkbox.
Also notice the `<html dir="rtl">` tag at the beginning of the generated html file -- you'll need that too.

::: warning CAVEAT
Quasar CLI automatically adds equivalent RTL CSS rules for your website/app code, but this is not the case for UMD where Quasar CLI is not being used. You'll have to manage writing the RTL equivalent of your website/app CSS code by yourself. It's only Quasar components that will have this handled automatically.
:::
