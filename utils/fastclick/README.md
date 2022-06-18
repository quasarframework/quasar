![Quasar Framework logo](https://cdn.quasar.dev/logo-v2/header.png)

# Fastclick for Quasar Framework
> This is a fork of the original Fastclick and is being used and maintained by Quasar Framework.<br>
> **This is injected only for iOS platform (PWA or Cordova) and assumes you're already on that platform.**

<img src="https://img.shields.io/npm/v/%40quasar/fastclick.svg?label=@quasar/fastclick">

FastClick is a simple, easy-to-use library for eliminating the 300ms delay between a physical tap and the firing of a `click` event on mobile browsers. The aim is to make your application feel less laggy and more responsive while avoiding any interference with your current logic.

## Compatibility ##

* iOS 7+ platform, on a Quasar PWA or Quasar Cordova

## Usage ##

```js
import Fastclick from '@quasar/fastclick'
FastClick()
```

## Advanced ##

### Ignore certain elements with `needsclick` ###

Sometimes you need FastClick to ignore certain elements. You can do this easily by adding the `needsclick` class.
```html
<a class="needsclick">Ignored by FastClick</a>
```

#### Use case 1: non-synthetic click required ####

Internally, FastClick uses `document.createEvent` to fire a synthetic `click` event as soon as `touchend` is fired by the browser. It then suppresses the additional `click` event created by the browser after that. In some cases, the non-synthetic `click` event created by the browser is required, as described in the [triggering focus example](http://ftlabs.github.com/fastclick/examples/focus.html).

This is where the `needsclick` class comes in. Add the class to any element that requires a non-synthetic click.

#### Use case 2: Twitter Bootstrap 2.2.2 dropdowns ####

Another example of when to use the `needsclick` class is with dropdowns in Twitter Bootstrap 2.2.2. Bootstrap add its own `touchstart` listener for dropdowns, so you want to tell FastClick to ignore those. If you don't, touch devices will automatically close the dropdown as soon as it is clicked, because both FastClick and Bootstrap execute the synthetic click, one opens the dropdown, the second closes it immediately after.

```html
<a class="dropdown-toggle needsclick" data-toggle="dropdown">Dropdown</a>
```

## Examples ##

FastClick is designed to cope with many different browser oddities. Here are some examples to illustrate this:

* [basic use](http://ftlabs.github.com/fastclick/examples/layer.html) showing the increase in perceived responsiveness
* [triggering focus](http://ftlabs.github.com/fastclick/examples/focus.html) on an input element from a `click` handler
* [input element](http://ftlabs.github.com/fastclick/examples/input.html) which never receives clicks but gets fast focus

## Credits and collaboration ##

The forked Fastclick is maintained by [Razvan Stoenescu](https://github.com/rstoenescu). Original contributors: [Rowan Beentje](http://twitter.com/rowanbeentje), [Matthew Caruana Galizia](http://twitter.com/mcaruanagalizia) and [Matthew Andrews](http://twitter.com/andrewsmatt) at [FT Labs](http://labs.ft.com). All open source code released by FT Labs is licensed under the MIT license. We welcome comments, feedback and suggestions.  Please feel free to raise an issue or pull request.
