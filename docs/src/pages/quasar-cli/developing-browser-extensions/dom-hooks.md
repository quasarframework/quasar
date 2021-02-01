---
title: DOM Hooks
desc: How to communicate to the underlying web page using dom hooks in Quasar Browser Extension mode.
---

`src-bex/js/dom-hooks.js` is a javascript file that is injected into the underlying web page automatically by Quasar but as with all the other hook files has access to the bridge via:

```js
export default function attachDomHooks (bridge) {
}
```

If you ever find yourself needing to inject a JS file into your underlying web page, you can use dom hooks instead as it means you can maintain that chain of communication in the BEX.

For example, lets say you wanted to write a BEX that detects whether or not a Quasar app is running on a page, the only way to do this is by running some javascript in the context of the web page.

```js
// detect-quasar.js:

function initQuasar (bridge, quasarInstance) {
  bridge.send('quasar.detect', {
    version: quasarInstance.version,
    dark: {
      isActive: quasarInstance.dark ? quasarInstance.dark.isActive : void 0
    },
    umd: quasarInstance.umd,
    iconSet: {
      name: quasarInstance.iconSet.name,
      __installed: quasarInstance.iconSet.__installed
    },
    lang: {
      rtl: quasarInstance.lang.rtl
    }
  })
  window.__QUASAR_DEVTOOLS__ = {
    Quasar: quasarInstance
  }
}

export default function detectQuasar (bridge) {
  if (window.Quasar) { // UMD
    initQuasar(bridge, {
      version: window.Quasar.version,
      dark: window.Quasar.Dark,
      ...window.Quasar,
      umd: true
    })
  }
  else { // CLI
    let isVue3 = false
    setTimeout(() => {
      const all = document.querySelectorAll('*')
      let el
      for (let i = 0; i < all.length; i++) {
        if (all[i].__vue__ || all[i].__vue_app__) {
          el = all[i]
          isVue3 = all[i].__vue_app__ !== void 0
          break
        }
      }

      if (el) {
        const Vue = isVue3 ? el.__vue_app__ : Object.getPrototypeOf(el.__vue__).constructor

        const quasar = isVue3 ? Vue.config.globalProperties.$q : Vue.prototype.$q
        if (quasar) {
          initQuasar(bridge, quasar, Vue)
        }
      }
    }, 100)
  }
}
```

```js
// dom-hooks.js:

import detectQuasar from './dom/detect-quasar'
export default function attachDomHooks (bridge) {
  detectQuasar(bridge)
}
```

The bridge above will notify all listeners in the BEX that Quasar has been found and along with that send the instance information.
