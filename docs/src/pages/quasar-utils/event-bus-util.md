---
title: EventBus Util
desc: An event emitter util.
keys: EventBus,bus,event
badge: v2.8.4+
---

Quasar supplies a global EventBus, especially useful when upgrading from Quasar v1 where the native Vue 2 interface has been dropped.

### Methods

```js
class EventBus {
  on (event: string, callback: Function, ctx?: any): this;
  once (event: string, callback: Function, ctx?: any): this;
  emit (event: string, ...args: any[]): this;
  off (event: string, callback?: Function): this;
}
```

### Usage

```js
import { EventBus } from 'quasar'

const bus = new EventBus()

bus.on('some-event', (arg1, arg2, arg3) => {
 // do some work
})

bus.emit('some-event', 'arg1 value', 'arg2 value', 'arg3 value')
```

When using TypeScript the events can be strongly-typed:

```js
// Quasar v2.11.11+
import { EventBus } from 'quasar'

const bus = new EventBus<{
    'some-event': (arg1: string, arg2: string, arg3: string) => void;
    'other': (arg: boolean) => void;
}>()

bus.emit('some-event', 'arg1 value', 'arg2 value', 'arg3 value')
```

### Convenience usage

Create a file in your app where you instantiate and export the new event bus then import and use it throughout your app.

Alternatively, when on a Quasar CLI project, for your convenience (so NOT required) you can create a boot file and supply an event bus (make sure that you register it in quasar.config.js > boot):

```js
// a Quasar CLI boot file (let's say /src/boot/bus.js)

import { EventBus } from 'quasar'
import { boot } from 'quasar/wrappers'

export default boot(({ app }) => {
  const bus = new EventBus()

  // for Options API
  app.config.globalProperties.$bus = bus

  // for Composition API
  app.provide('bus', bus)
})
```

Then, in any of your components, you can use:

```js
// Options API
this.$bus

// Composition API
import { inject } from 'vue'

const bus = inject('bus') // inside setup()
```
