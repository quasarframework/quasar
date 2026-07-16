---
title: Starter kit equivalent
desc: Tips and tricks on how to use a Quasar App Extension to create the equivalent of a starter kit.
scope:
  tree:
    l: '/ae'
    c:
      - l: README.md
      - l: package.json
      - l: src
        c:
          - l: templates
            c:
              - l: common-files
                c:
                  - l: README.md
                  - l: some-folder
                    c:
                      - l: tasks.md
              - l: serviceA
                c:
                  - l: src
                    c:
                      - l: services
                        c:
                          - l: serviceA.js
                            e: (or .ts)
              - l: serviceB
                c:
                  - l: src
                    c:
                      - l: services
                        c:
                          - l: serviceB.js
                            e: (or .ts)
          - l: index.js
            e: (or .ts) Described in Index API
          - l: install.js
            e: (or .ts) Described in Install API
          - l: prompts.js
            e: (or .ts) Described in Prompts API
          - l: uninstall.js
            e: (or .ts) Described in Uninstall API
---

This guide is for when you want to create what essentially is a "starter kit" that adds stuff (/quasar.config file configuration, folders, files, CLI hooks) on top of the official starter kit. This allows you to have multiple projects sharing a common structure/logic (and only one package to manage them rather than having to change all projects individually to match your common pattern), and also allows you to share all this with the community.

::: tip
In order for creating an App Extension project folder, please first read the [Development Guide > Introduction](/app-extensions/development-guide/introduction).
:::

::: tip Full Example
To see an example of what we will build, head over to the [MyStarterKit full example](https://github.com/quasarframework/app-extension-examples/tree/v3/my-starter-kit) on GitHub.
:::

We'll be creating an example App Extension which does the following:

- it prompts the user what features it wants this App Extension to install
- renders (copies) files into the host app according to the user's answers
- it extends the /quasar.config file
- it extends the Vite configuration
- it uses an App Extension hook (onPublish)
- it removes the added files when the App Extension gets uninstalled
- it uses the prompts to define what the App Extension does

## The structure

For the intents of this example, we'll be creating the following folder structure:

<DocTree :def="scope.tree" />

## The Prompts script

The prompts script below uses [@clack/prompts](https://www.npmjs.com/package/@clack/prompts), but you can replace it with anything if you want to. Just remember to install the prompt package that you are using (in `/ae`, into `dependencies`, since it will be a runtime dependency).

This script will be called upon AE installation/invoking procedure.

```js /ae/src/prompts.js (or .ts)
/**
 * Quasar App Extension prompts script
 * https://quasar.dev/app-extensions/development-guide/prompts-api
 */

import { definePromptsScript } from '#q-app'
import { intro, outro, confirm, text, group, cancel } from '@clack/prompts'

export default definePromptsScript(async (/* api */) => {
  intro('Starter Kit App Extension')

  const answers = await group(
    {
      serviceA: () => confirm({ message: 'Do you want service "A"?' }),
      serviceB: () => confirm({ message: 'Do you want service "B"?' }),
      productName: ({ results }) => {
        if (!results.serviceB) return
        return text({
          message: 'Since you want service "B", what is the Product Name?',
          initialValue: 'MyProduct',
          validate(value) {
            if (value.length === 0) return 'Please enter a product name'
          }
        })
      },
      publishService: () =>
        confirm({
          message: 'Do you want the publishing service?',
          initialValue: true
        })
    },
    {
      // On Cancel callback that wraps the group
      // So if the user cancels one of the prompts in the group this function will be called
      onCancel: (/* { results } */) => {
        cancel('Operation cancelled.')
        process.exit(0)
      }
    }
  )

  outro('Thanks for answering the questions!')

  return answers
})
```

## The Install script

The install script below is only rendering files into the hosted app. Notice the `/src/templates` folder above, where we decided to keep these templates.

```js /ae/src/install.js (or .ts)
import { defineInstallScript } from '#q-app'

export default defineInstallScript(api => {
  // (Optional!)
  // Quasar compatibility check; you may need
  // hard dependencies, as in a minimum version of the "quasar"
  // package or a minimum version of Quasar App CLI
  api.compatibleWith('quasar', '^2.0.0')
  api.compatibleWith('@quasar/app-vite', '^3.0.0')

  // We render some files into the hosting project

  if (api.prompts.serviceA) {
    api.render('./templates/serviceA')
  }

  if (api.prompts.serviceB) {
    // we supply interpolation variables
    // to the template
    api.render('./templates/serviceB', {
      productName: api.prompts.productName
    })
  }

  // we always render the following template:
  api.render('./templates/common-files')
})
```

Notice that we use the prompts to decide what to render into the hosting project. Furthermore, if the user has selected "service B", then we'll also have a "productName" that we can use when we render the service B's file.

## The Index script

We do a few things in the index script, like extending the /quasar.config file, hooking into one of the many Index API hooks (onPublish in this case):

```js /ae/src/index.js (or .ts)
import { defineIndexScript } from '#q-app'

export default defineIndexScript(api => {
  // (Optional!)
  // Quasar compatibility check; you may need
  // hard dependencies, as in a minimum version of the "quasar"
  // package or a minimum version of Quasar App CLI
  api.compatibleWith('quasar', '^2.0.0')
  api.compatibleWith('@quasar/app-vite', '^3.0.0')

  // Here we extend the /quasar.config file;
  // (extendQuasarConf() will be defined later in this tutorial, continue reading)
  api.extendQuasarConf(extendQuasarConf)

  // Here we register the onPublish hook,
  // only if the user requested the publishing service
  if (api.prompts.publishService) {
    // onPublish() will be defined later in this tutorial, continue reading
    api.onPublish(onPublish)
  }

  api.extendViteConf(extendVite)

  // there's lots more hooks that you can use...
})
```

Here's an example of `extendQuasarConf` definition:

```js
function extendQuasarConf(conf, api) {
  conf.extras.push('ionicons-v4')
  conf.framework.iconSet = 'ionicons-v4'

  //
  // We register a boot file. User does not need to tamper with it,
  // so we keep it into the App Extension code:
  //

  // make sure my-ext boot file is registered
  conf.boot.push(
    '~quasar-app-extension-my-starter-kit/src/runtime/my-starter-kit-boot.js'
  )
}
```

The `onPublish` function:

```js
function onPublish(api, { arg, distDir }) {
  // this hook is called when "quasar build --publish" is called

  // your publish logic here...
  console.log('We should publish now. But maybe later? :)')

  // are we trying to publish a Cordova app?
  if (api.ctx.modeName === 'cordova') {
    // do something
  }
}
```

The `extendVite` function:

```js
function extendVite(viteConf, { isClient, isServer }, api) {
  // viteConf is a Vite config object generated by Quasar CLI
}
```

## The Uninstall script

When the App Extension is uninstalled, we need to do some cleanup. Be careful about what you delete from the host app because some files may still be needed.

```js
import { defineUninstallScript } from '#q-app'

export default defineUninstallScript(api => {
  // Careful when you remove folders!
  // You don't want to delete files that are still needed by the Project,
  // or files that are not owned by this app extension.

  // Here, we could also remove the /src/services folder altogether,
  // but what if the user has added other files into this folder?

  if (api.prompts.serviceA) {
    // we added it on install, so we remove it
    api.removePath('src/services/serviceA.js')
  }

  if (api.prompts.serviceB) {
    // we added it on install, so we remove it
    api.removePath('src/services/serviceB.js')
  }

  // we added it on install, so we remove it
  api.removePath('some-folder')
  // warning... we've added this folder, but what if the
  // developer added more files into this folder???
})
```

See [api.removePath](/app-extensions/development-guide/uninstall-api#api-removepath) for details. Only remove files that the extension owns; a user may have added content to a directory after installation.
