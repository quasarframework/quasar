![Quasar Framework logo](https://cdn.quasar.dev/logo-v2/header.png)

# Quasar Framework UI Testing

> IMPORTANT!
> All commands should be run from `/ui`, not from `/ui/test`.

## Test environment

Tests run in a real headless Chromium browser through
[Vitest browser mode](https://vitest.dev/guide/browser/) (Playwright provider),
not in jsdom. The Chromium binary is installed automatically the first time
you run the test scripts (through their `pre` lifecycle hooks); no manual
setup step is needed.

Notes on the environment:

- `mount()`/`shallowMount()` from `@vue/test-utils` are wrapped (see
  `test/runtime/test-utils.js`) so components are attached to the document
  by default. This makes computed styles and real layout (sizes, positions,
  scrolling) work. Pass your own `attachTo` option to opt out.
- The default viewport is 1280x800 (desktop). If a test needs a different
  viewport size, use `page.viewport()` from `@vitest/browser/context` and
  restore the default afterwards.
- Layout, scrolling, focus, CSS animations/transitions, `ResizeObserver`,
  `IntersectionObserver`, media queries etc. are all real and often
  asynchronous — prefer awaiting effects (`vi.waitFor()`, `expect.poll()`)
  over synchronous assumptions.
- `console.error`/`console.warn` calls fail the running test (see
  `test/vitest.setup.js`).
- `vue` resolves through its standard package exports (no alias), which is
  the runtime-only build — there is no runtime template compilation. Write
  test components with render functions (`h()`, `withDirectives()`) instead
  of `template:` strings, and use `() => h(...)` for slots containing
  markup.

## Using the Specs script

### Steps for a new test file

1. Use the Specs script to generate the draft of the new testing file
   (a missing or stale `dist` self-heals through the build stamp):

```bash
$ pnpm test:specs --target <target_file>
# "target" refers to the original file upon which a test
# file will be generated here

# Examples:
#   $ pnpm test:specs -t QBtn
#   $ pnpm test:specs -t use-btn
#   $ pnpm test:specs -t composable
```

2. Edit the file, gradually removing the `.todo` suffix from the `test()` calls. Do not leave any `.todo()` or `.skip()` modifiers for all describe/test calls.

3. Should you want to discard a `describe()` or `test()` section, just delete it then call the Specs script again and add an ignore statement:

```bash
$ pnpm test:specs --target <target_file>
# ...then select to ignore the missing tests
```

4. You might want to also start Vitest to verify what you are writing in the test file:

```bash
# withOUT Vitest UI:
$ pnpm test:watch

# to watch only a specific file pattern
$ pnpm test:watch "QList"

# with Vitest UI:
$ pnpm test:watch:ui
```

5. When you are done with the test file, verify that the contents of the test file is OK:

```bash
$ pnpm test:specs --target <target_file>
# ...it should not output any errors
```

...and that all the tests are passing!

### Free-form categories

Besides the generated categories (`[Props]`, `[Slots]`, `[Events]`,
`[Methods]`, ...), validation also accepts two hand-written ones:

- `[Generic]` — behavioral coverage that does not map to a specific API
  entry (it is also the fallback the script generates for API-less files)
- `[Accessibility]` — keyboard interaction and ARIA semantics coverage

Their contents are free-form (any describe/test structure), but they must
not be left empty.

### Steps for adding new sections to a test file

So you've added a new prop/method/...etc to a Component/Directive/...etc and you've edited its JSON file (if it has one). This should make the Specs script to output an error that some tests are missing for the respective test file.

1. Run the Specs script so it can generate the missing pieces for you
   (a missing or stale `dist` self-heals through the build stamp):

```bash
$ pnpm test:specs --target <target_file>
# ...and it will prompt you to add
# the missing tests or to add ignore statements
# (and you can handle each of the issues separately)
```

2. Edit the file, gradually removing the `.todo` suffix from the `test()` calls. Do not leave any `.todo()` or `.skip()` modifiers for all describe/test calls after you finish.

3. You might want to also start Vitest to verify what you are writing in the test file:

```bash
# withOUT Vitest UI:
$ pnpm test:watch

# with Vitest UI:
$ pnpm test:watch:ui
```

4. After you're done with the test file, verify that the contents of the test file is OK:

```bash
$ pnpm test:specs --target <target_file>
# ...it should not output any errors
```

...and that all the tests are passing!

### Steps for re-generating a test file section

So you've changed a prop/method/...etc on a Component/Directive/...etc and you've edited its JSON file (if it has one). Now the Specs script will not output any error since no tests are missing in the respective test file. But you can re-generate the test file section(s) where changes need to be made by targeting them:

1. Run the Specs script so it can generate the missing pieces for you for
   each of the sections (your JSON edit staled the build stamp, so the
   `dist` API self-heals with a rebuild first):

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

2. The content that gets outputted to the terminal is automatically copied to the clipboard. Should you need just a part of it, just copy that part only. Remember to remove the `.todo` modifier from the `test()` calls at the end.

3. You might want to also start Vitest to verify what you are writing in the test file:

```bash
# withOUT Vitest UI:
$ pnpm test:watch

# with Vitest UI:
$ pnpm test:watch:ui
```

4. After you're done with the test file, verify that the contents of the test file is OK:

```bash
$ pnpm test:specs --target <target_file>
# ...it should not output any errors
```

...and that all the tests are passing!

## Guidelines for testing

- Keep testing code clean and easily understandable. Add comments if necessary.
- Look into the code of what you are testing to decide the best approach for your tests.
- Convert tests for multiple values/types of the same thing into an test.each() where it applies. There are lots of examples in the already existing test files.
- Watch for `$computedStyle()` calls as these get cached, so you only get one chance per node to get the expected result. Usually leave this as the last expect() call.
- Test the effect while not duplicating the implementation of what you are testing. Where you can, use `$computedStyle()`.
- Be aware of the common formulas (below).
- There are some custom matchers that you can use (`$any`, `$emits`, `$props`, `$arrayValues`, `$objectValues`, `$ref`, `$reactive`) and also some extra @vue/test-utils mount() additions (`$style`, `$computedStyle`): [code](https://github.com/quasarframework/quasar/blob/dev/ui/test/vitest.setup.js)
- Use of Copilot when writing the tests is allowed ;)

Important reading list:

- https://vitest.dev/api/expect.html
- https://test-utils.vuejs.org/api/
- https://vitest.dev/api/
- https://vitest.dev/api/vi.html

## Common formulas for writing tests

> When instructed to search for something, do it in /ui/src/\*_/_.test.js files.

| Need                           | Formula                                                                            |
| ------------------------------ | ---------------------------------------------------------------------------------- |
| Use Vue Router                 | Search for `getRouter`                                                             |
| Testing Vue Router props       | Search for `[(prop)to]` or `[(prop)active-class]`. Example: QBreadcrumbsEl.test.js |
| Testing color/text-color props | Search for `[(prop)color]` and `[(prop)text-color]`. Example: QBtn.test.js         |
| Speed up timers                | Search for `useFakeTimers()`                                                       |

## Changing the Specs script code

If you change the specs script code, then you need to test it:

```bash
# a dry-run test (dist self-heals through the build stamp):
$ pnpm test:specs --dry-run
# ...it should not output any errors

# also do a test for existing files:
$ pnpm test:specs:ci
# ...it should not output any errors
```

## License

Copyright (c) 2015-present Razvan Stoenescu

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
