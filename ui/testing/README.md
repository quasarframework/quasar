![Quasar Framework logo](https://cdn.quasar.dev/logo-v2/header.png)

# Quasar Framework UI Testing

> IMPORTANT!
> All commands should be run from `/ui`, not from `/ui/testing`.

## Using the Specs script

### Steps for a new test file

1. Ensure that the UI has been built:

```bash
$ pnpm build
```

2. Use the Specs script to generate the draft of the new testing file:

```bash
$ pnpm test:specs --target <target_file>
# "target" refers to the original file upon which a test
# file will be generated here

# Examples:
#   $ pnpm test:specs -t QBtn
#   $ pnpm test:specs -t use-btn
#   $ pnpm test:specs -t composable
```

3. Edit the file, gradually removing the `.todo` suffix from the `test()` calls. Do not leave any `.todo()` or `.skip()` modifiers for all describe/test calls.

4. Should you want to discard a `describe()` or `test()` section, just delete it then call the Specs script again and add an ignore statement:

```bash
$ pnpm test:specs --target <target_file>
# ...then select to ignore the missing tests
```

5. You might want to also start Vitest to verify what you are writing in the test file:

```bash
# withOUT Vitest UI:
$ pnpm test:watch

# to watch only a specific file pattern
$ pnpm test:watch "QList"

# with Vitest UI:
$ pnpm test:watch:ui
```

6. When you are done with the test file, verify that the contents of the test file is OK:

```bash
$ pnpm test:specs --target <target_file>
# ...it should not output any errors
```

...and that all the tests are passing!

### Steps for adding new sections to a test file

So you've added a new prop/method/...etc to a Component/Directive/...etc and you've edited its JSON file (if it has one). This should make the Specs script to output an error that some tests are missing for the respective test file.

1. Ensure that the UI has been built:

```bash
$ pnpm build
```

2. Run the Specs script so it can generate the missing pieces for you:

```bash
$ pnpm test:specs --target <target_file>
# ...and it will prompt you to add
# the missing tests or to add ignore statements
# (and you can handle each of the issues separately)
```

3. Edit the file, gradually removing the `.todo` suffix from the `test()` calls. Do not leave any `.todo()` or `.skip()` modifiers for all describe/test calls after you finish.

4. You might want to also start Vitest to verify what you are writing in the test file:

```bash
# withOUT Vitest UI:
$ pnpm test:watch

# with Vitest UI:
$ pnpm test:watch:ui
```

5. After you're done with the test file, verify that the contents of the test file is OK:

```bash
$ pnpm test:specs --target <target_file>
# ...it should not output any errors
```

...and that all the tests are passing!

### Steps for re-generating a test file section

So you've changed a prop/method/...etc on a Component/Directive/...etc and you've edited its JSON file (if it has one). Now the Specs script will not output any error since no tests are missing in the respective test file. But you can re-generate the test file section(s) where changes need to be made by targeting them:

1. Ensure that the UI has been built:

```bash
$ pnpm build
```

2. Run the Specs script so it can generate the missing pieces for you for each of the sections:

```bash
$ pnpm test:specs --target <target_file> --generate <json_root_prop>.<json_subprop>
# ...and it will output how the section should look like

# Examples:
#   $ pnpm test:specs -t QBtn -g props.label
#   $ pnpm test:specs -t QBtn -g events.click
#   $ pnpm test:specs -t QBtn -g "events.update:model-value"
#   $ pnpm test:specs -t QBtn -g methods.click
```

For NON component/directive/plugin files (so composables or other generic js files), there is no JSON (composables may have a JSON but it does not refer to the explicit exported content of the file so it is ignored), but the Specs script can still infer the contents and generate the missing pieces for you:

```bash
# target the default exporting function
$ pnpm test:specs -t set-css-var -g functions.default

# target the default exporting object:
$ pnpm test:specs -t set-css-var -g variables.default

# target the default exporting class:
$ pnpm test:specs -t EventBus -g classes.default

# target a named exported variable
$ pnpm test:specs -t set-css-var -g variables.useSizeDefaults

# target a named exported class
$ pnpm test:specs -t set-css-var -g classes.myClassName

# target a named exported function
$ pnpm test:specs -t global-nodes -g functions.createGlobalNode
```

3. The content that gets outputted to the terminal is automatically copied to the clipboard. Should you need just a part of it, just copy that part only. Remember to remove the `.todo` modifier from the `test()` calls at the end.

4. You might want to also start Vitest to verify what you are writing in the test file:

```bash
# withOUT Vitest UI:
$ pnpm test:watch

# with Vitest UI:
$ pnpm test:watch:ui
```

5. After you're done with the test file, verify that the contents of the test file is OK:

```bash
$ pnpm test:specs --target <target_file>
# ...it should not output any errors
```

...and that all the tests are passing!

## Guidelines for testing

* Keep testing code clean and easily understandable. Add comments if necessary.
* Look into the code of what you are testing to decide the best approach for your tests.
* Convert tests for multiple values/types of the same thing into an test.each() where it applies. There are lots of examples in the already existing test files.
* Watch for `$computedStyle()` calls as these get cached, so you only get one chance per node to get the expected result. Usually leave this as the last expect() call.
* Test the effect while not duplicating the implementation of what you are testing. Where you can, use `$computedStyle()`.
* Be aware of the common formulas (below).
* There are some custom matchers that you can use (`$any`, `$arrayValues`, `$objectValues`, `$ref`, `$reactive`) and also some extra @vue/test-utils mount() additions (`$style`, `$computedStyle`): [code](https://github.com/quasarframework/quasar/blob/dev/ui/testing/setup.js)
* Use of Copilot when writing the tests is allowed ;)

Important reading list:
* https://vitest.dev/api/expect.html
* https://test-utils.vuejs.org/api/
* https://vitest.dev/api/
* https://vitest.dev/api/vi.html

## Common formulas for writing tests

> When instructed to search for something, do it in /ui/src/**/*.test.js files.

| Need | Formula |
| --- | --- |
| Use Vue Router | Search for `getRouter` |
| Testing Vue Router props | Search for `[(prop)to]` or `[(prop)active-class]`. Example: QBreadcrumbsEl.test.js |
| Testing color/text-color props | Search for `[(prop)color]` and `[(prop)text-color]`. Example: QBtn.test.js |
| Speed up timers | Search for `useFakeTimers()` |

## Changing the Specs script code

If you change the specs script code, then you need to test it:

```bash
# we first build the UI:
$ pnpm build

# then we do a dry-run test:
$ pnpm test:specs --dry-run
# ...it should not output any errors

# also do a test for existing files:
$ pnpm test:specs:ci
# ...it should not output any errors
```

## License

Copyright (c) 2015-present Razvan Stoenescu

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
