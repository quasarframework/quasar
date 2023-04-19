---
title: Other Utils
desc: A set of miscellaneous Quasar methods for debouncing or throttling functions, deep copying objects, cross-platform URL opening or handling DOM events.
keys: openURL,copyToClipboard,exportFile,debounce,frameDebounce,throttle,extend,uid,event
---

::: tip
For usage with the UMD build see [here](/start/umd#quasar-global-object).
:::

## openURL

```js
import { openURL } from 'quasar'

openURL('http://...')

// full syntax:
openURL(
  String url,
  Function rejectFn, // optional; gets called if window cannot be opened
  Object windowFeatures // optional requested features for the new window
)
```

It will take care of the quirks involved when running under Cordova, Electron or on a browser, including notifying the user he/she has to acknowledge opening popups.

When wrapping with Cordova (or Capacitor), it's best (but not "a must do") if [InAppBrowser](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-inappbrowser/) Cordova plugin is also installed, so that openURL can hook into that.

If running on iOS and [cordova-plugin-safariviewcontroller](https://github.com/EddyVerbruggen/cordova-plugin-safariviewcontroller) is installed, then openURL will first try to hook into it.

The optional `windowFeatures` parameter should be an Object with keys from [window.open() windowFeatures](https://developer.mozilla.org/en-US/docs/Web/API/Window/open) and Boolean values (as described in the example below). Please note that these features will not be taken into account when openURL does not defers to using `window.open()`.

```js
// example of openURL() with windowFeatures:

openURL(
  'http://...',
  undefined, // in this example we don't care about the rejectFn()

  // this is the windowFeatures Object param:
  {
    noopener: true, // this is set by default for security purposes
                    // but it can be disabled if specified with a Boolean false value
    menubar: true,
    toolbar: true,
    noreferrer: true,
    // .....any other window features
  }
)
```

::: tip
If you want to open the telephone dialer in a Cordova app, don't use `openURL()`. Instead you should directly use `<a href="tel:123456789">` tags or `<QBtn href="tel:123456789">`
:::

## copyToClipboard

The following is a helper to copy some text to Clipboard. The method returns a Promise.

```js
import { copyToClipboard } from 'quasar'

copyToClipboard('some text')
  .then(() => {
    // success!
  })
  .catch(() => {
    // fail
  })
```

## exportFile

The following is a helper to trigger the browser to start downloading a file with the specified content.

```js
/**
 * Forces browser to download file with specified content
 *
 * @param {*} fileName - String
 * @param {*} rawData - String | ArrayBuffer | ArrayBufferView | Blob
 * @param {*} opts - String (mimeType) or Object
 *                   Object form: { mimeType?: String, byteOrderMark?: String | Uint8Array, encoding?: String }
 * @returns Boolean | Error
 */
```

The `opts` parameter is optional and can be a String (mimeType) or an Object with the following form:

 * **mimeType** (optional)

   Examples: 'application/octect-stream' (default), 'text/plain', 'application/json', 'text/plain;charset=UTF-8', 'video/mp4', 'image/png', 'application/pdf'
   [https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)

 * **byteOrderMark** (optional)

   (BOM) Example: '\uFEFF'
   [https://en.wikipedia.org/wiki/Byte_order_mark](https://en.wikipedia.org/wiki/Byte_order_mark)

 * **encoding** (optional)

   Performs a TextEncoder.encode() over the rawData;
   Example: 'windows-1252' (ANSI, a subset of ISO-8859-1)
   [https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder)

Examples:

```js
import { exportFile } from 'quasar'

const status = exportFile('important.txt', 'some content')

if (status === true) {
  // browser allowed it
}
else {
  // browser denied it
  console.log('Error: ' + status)
}
```

```js
import { exportFile } from 'quasar'

const status = exportFile('file.csv', 'éà; ça; 12\nà@€; çï; 13', {
  encoding: 'windows-1252',
  mimeType: 'text/csv;charset=windows-1252;'
})

if (status === true) {
  // browser allowed it
}
else {
  // browser denied it
  console.error('Error: ' + status)
}
```

## runSequentialPromises <q-badge label="v2.8.4+" />

The following is a helper to run multiple Promises sequentially. **Optionally, on multiple threads.**

```js
/**
 * Run a list of Promises sequentially, optionally on multiple threads.
 *
 * @param {*} sequentialPromises - Array of Functions or Object with Functions as values
 *                          Array of Function form: [ (resultAggregator: Array) => Promise<any>, ... ]
 *                          Object form: { [key: string]: (resultAggregator: object) => Promise<any>, ... }
 * @param {*} opts - Optional options Object
 *                   Object form: { threadsNumber?: number, abortOnFail?: boolean }
 *                   Default: { threadsNumber: 1, abortOnFail: true }
 *                   When configuring threadsNumber AND using http requests, be
 *                       aware of the maximum threads that the hosting browser
 *                       supports (usually 5); any number of threads above that
 *                       won't add any real benefits
 * @returns Promise<Array<Object> | Object>
 *    With opts.abortOnFail set to true (which is default):
 *        When sequentialPromises param is Array:
 *          The Promise resolves with an Array of Objects of the following form:
 *             [ { key: number, status: 'fulfilled', value: any }, ... ]
 *          The Promise rejects with an Object of the following form:
 *             { key: number, status: 'rejected', reason: Error, resultAggregator: array }
 *        When sequentialPromises param is Object:
 *          The Promise resolves with an Object of the following form:
 *             { [key: string]: { key: string, status: 'fulfilled', value: any }, ... }
 *          The Promise rejects with an Object of the following form:
 *             { key: string, status: 'rejected', reason: Error, resultAggregator: object }
 *    With opts.abortOnFail set to false:
 *       The Promise is never rejected (no catch() needed)
 *       The Promise resolves with:
 *          An Array of Objects (when sequentialPromises param is also an Array) of the following form:
 *             [ { key: number, status: 'fulfilled', value: any } | { status: 'rejected', reason: Error }, ... ]
 *          An Object (when sequentialPromises param is also an Object) of the following form:
 *             { [key: string]: { key: string, status: 'fulfilled', value: any } | { key: string, status: 'rejected', reason: Error }, ... }
 */
```

Note that:
* the `sequentialPromises` param is an Array of Functions (each Function returns a Promise)
* each function in `sequentialPromises` receives one param which is the `resultAggregator`, so basically you can use the results of the previous promises to decide what to do with the current promise; each entry in the resultAggregator that hasn't been settled yet is marked as `null`
* the `opts` parameter is optional.

Generic example (with `sequentialPromises` param as Array):

```js
import { runSequentialPromises } from 'quasar'

runSequentialPromises([
  (resultAggregator) => new Promise((resolve, reject) => { /* do some work... */ }),
  (resultAggregator) => new Promise((resolve, reject) => { /* do some work... */ })
  // ...
]).then(resultAggregator => {
  // resultAggregator is ordered in the same way as the promises above
  console.log('result from first Promise:', resultAggregator[0].value)
  console.log('result from second Promise:', resultAggregator[1].value)
  // ...
}).catch(errResult => {
  console.error(`Error encountered on job #${ errResult.key }:`)
  console.error(errResult.reason)
  console.log('Managed to get these results before this error:')
  console.log(errResult.resultAggregator)
})
```

Generic example (with `sequentialPromises` param as Object):

```js
import { runSequentialPromises } from 'quasar'

runSequentialPromises({
  phones: (resultAggregator) => new Promise((resolve, reject) => { /* do some work... */ }),
  laptops: (resultAggregator) => new Promise((resolve, reject) => { /* do some work... */ })
  // ...
}).then(resultAggregator => {
  console.log('result from first Promise:', resultAggregator.phones.value)
  console.log('result from second Promise:', resultAggregator.laptops.value)
  // ...
}).catch(errResult => {
  console.error(`Error encountered on job (${ errResult.key}):`)
  console.error(errResult.reason)
  console.log('Managed to get these results before this error:')
  console.log(errResult.resultAggregator)
})
```

Example using previous results:

```js
import { runSequentialPromises } from 'quasar'

runSequentialPromises({
  phones: () => new Promise((resolve, reject) => { /* do some work... */ }),
  vendors: (resultAggregator) => {
    new Promise((resolve, reject) => {
      // You can do something with resultAggregator.phones.value here...
      // Since are using the default abortOnFail option, the result is guaranteed to exist,
      // so you don't have to guard resultAggregator.phones against "null"
    })
  }
  // ...
})
```

Example with Axios:

```js
import { runSequentialPromises } from 'quasar'
import axios from 'axios'

const keyList = [ 'users', 'phones', 'laptops' ]

runSequentialPromises([
  () => axios.get('https://some-url.com/users'),
  () => axios.get('https://some-other-url.com/items/phones'),
  () => axios.get('https://some-other-url.com/items/laptops')
]).then(resultAggregator => {
  // resultAggregator is ordered in the same way as the promises above
  resultAggregator.forEach(result => {
    console.log(keyList[ result.key ], result.value) // example: users {...}
  })
}).catch(errResult => {
  console.error(`Error encountered while fetching ${ keyList[ errResult.key ] }:`)
  console.error(errResult.reason)
  console.log('Managed to get these results before this error:')
  console.log(errResult.resultAggregator)
})

// **equivalent** example with sequentialPromises as Object:

runSequentialPromises({
  users: () => axios.get('https://some-url.com/users'),
  phones: () => axios.get('https://some-other-url.com/items/phones'),
  laptops: () => axios.get('https://some-other-url.com/items/laptops')
}).then(resultAggregator => {
  console.log('users:', resultAggregator.users.value)
  console.log('phones:', resultAggregator.phones.value)
  console.log('laptops:', resultAggregator.laptops.value)
}).catch(errResult => {
  console.error(`Error encountered while fetching ${ errResult.key }:`)
  console.error(errResult.reason)
  console.log('Managed to get these results before this error:')
  console.log(errResult.resultAggregator)
})
```

Example with abortOnFail set to `false`:

```js
import { runSequentialPromises } from 'quasar'
import axios from 'axios'

// notice no "catch()"; runSequentialPromises() will always resolve
runSequentialPromises(
  {
    users: () => axios.get('https://some-url.com/users'),
    phones: () => axios.get('https://some-other-url.com/items/phones'),
    laptops: () => axios.get('https://some-other-url.com/items/laptops')
  },
  { abortOnFail: false }
).then(resultAggregator => {
  Object.values(resultAggregator).forEach(result => {
    if (result.status === 'rejected') {
      console.log(`Failed to fetch ${ result.key }:`, result.reason)
    }
    else {
      console.log(`Succeeded to fetch ${ result.key }:`, result.value)
    }
  })
})
```

When configuring threadsNumber (`opts > threadsNumber`) AND using http requests, be aware of the maximum threads that the hosting browser supports (usually 5). Any number of threads above that won't add any real benefits.

```js
import { runSequentialPromises } from 'quasar'

runSequentialPromises([ /* ... */ ], { threadsNumber: 3 })
  .then(resultAggregator => {
    resultAggregator.forEach(result => {
      console.log(result.value)
    })
  })
  .catch(errResult => {
    console.error(`Error encountered:`)
    console.error(errResult.reason)
    console.log('Managed to get these results before this error:')
    console.log(errResult.resultAggregator)
  })
```

## debounce
If your App uses JavaScript to accomplish taxing tasks, a debounce function is essential to ensuring a given task doesn't fire so often that it bricks browser performance. Debouncing a function limits the rate at which the function can fire.

Debouncing enforces that a function not be called again until a certain amount of time has passed without it being called. As in "execute this function only if 100 milliseconds have passed without it being called."

A quick example: you have a resize listener on the window which does some element dimension calculations and (possibly) repositions a few elements. That isn't a heavy task in itself but being repeatedly fired after numerous resizes will really slow your App down. So why not limit the rate at which the function can fire?

```js
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
import { debounce } from 'quasar'

(Debounced Function) debounce(Function fn, Number milliseconds_to_wait, Boolean immediate)

// Example:
window.addEventListener(
  'resize',
  debounce(function() {
    // .... things to do ...
  }, 300 /*ms to wait*/)
)
```

Or calling as a method in a .vue file:

```js
methods: {
  myMethod () { .... }
},

created () {
  this.myMethod = debounce(this.myMethod, 500)
}
```

::: warning
Debouncing your functions using a method declaration like `myMethod: debounce(function () { // Code }, 500)` will mean that the debounced method will be shared between *all* rendered instances of this component, so debouncing is also shared. Moreover, `this.myMethod.cancel()` won't work, because Vue wraps each method with another function to ensure proper `this` binding. This should be avoided by following the code snippet above.
:::

There's also a `frameDebounce` available which delays calling your function until next browser frame is scheduled to run (read about `requestAnimationFrame`).

```js
import { frameDebounce } from 'quasar'

(Debounced Function) frameDebounce(Function fn)

// Example:
window.addEventListener(
  'resize',
  frameDebounce(function() {
    .... things to do ...
  })
)
```

## throttle
Throttling enforces a maximum number of times a function can be called over time. As in "execute this function at most once every X milliseconds."

```js
import { throttle } from 'quasar'

(Throttled Function) throttle(Function fn, Number limit_in_milliseconds)

// Example:
window.addEventListener(
  'resize',
  throttle(function() {
    .... things to do ...
  }, 300 /* execute at most once every 0.3s */)
)
```

Or calling as a method in a .vue file:

```js
methods: {
  myMethod () { .... }
},

created () {
  this.myMethod = throttle(this.myMethod, 500)
}
```

::: warning
Throttling your functions using a method declaration like `myMethod: throttle(function () { // Code }, 500)` will mean that the throttled method will be shared between *all* rendered instances of this component, so throttling is also shared. This should be avoided by following the code snippet above.
:::

## extend - (Deep) Copy Objects
A basic respawn of `jQuery.extend()`. Takes same parameters:

```js
import { extend } from 'quasar'

let newObject = extend([Boolean deepCopy], targetObj, obj, ...)
```

Watch out for methods within objects.

## uid - Generate UID
Generate unique identifiers:

```js
import { uid } from 'quasar'

let uid = uid()
// Example: 501e7ae1-7e6f-b923-3e84-4e946bff31a8
```

## Handling event on a DOM event handler
It's cross-browser.

```js
import { event } from 'quasar'

node.addEventListener('click', evt => {
  // left clicked?
  (Boolean) event.leftClick(evt)

  // middle clicked?
  (Boolean) event.middleClick(evt)

  // right clicked?
  (Boolean) event.rightClick(evt)

  // key in number format
  (Number) event.getEventKey(evt)

  // Mouse wheel distance (in pixels)
  (Object {x, y}) event.getMouseWheelDistance(evt)

  // position on viewport
  // works both for mouse and touch events!
  (Object {top, left}) event.position(evt)

  // get target DOM Element on which mouse or touch
  // event has fired upon
  (DOM Element) event.targetElement(evt)

  // call stopPropagation and preventDefault
  event.stopAndPrevent(evt)
})
```
