![Quasar Framework logo](https://cdn.quasar.dev/logo-v2/header.png)

# Quasar Framework UI Testing

> IMPORTANT!
> All commands should be run from `/ui`, not from `/ui/testing`.

## Steps for a new test file

1. Use the Specs script to generate the draft of the new testing file:

```bash
$ pnpm test:specs --target <target_file>
# "target" refers to the original file upon which a test
# file will be generated here

# Examples:
#   $ pnpm test:specs -t QBtn
#   $ pnpm test:specs -t use-btn
#   $ pnpm test:specs -t composable
```

2. Edit the file, gradually removing the `.todo` suffix from the `test()` calls. Do not leave any `test.todo()` call (also see step 3 below).
3. Should you want to discard a `describe()` section, just delete it then call the Specs script again and add an ignore statement:

```bash
$ pnpm test:specs --interactive --target <target_file>
# ...then select to ignore the missing tests
```

4. When you are done with the test file, verify that the contents of the test file is OK:

```bash
$ pnpm test:specs --target <target_file>
# ...it should not output any errors
```

## Steps for adding new sections to a test file

So you've added a new prop/method/...etc to a Component/Directive/...etc and you've edited its JSON file (if it has one). This should make the Specs script to output an error that some tests are missing for the respective test file.

1. Run the Specs script so it can generate the missing pieces for you:

```bash
$ pnpm test:specs --interactive --target <target_file>
# ...and it will prompt you to add
# the missing tests or to add ignore statements
# (and you can handle each of the issues separately)
```

2. Edit the file, gradually removing the `.todo` suffix from the `test()` calls. Do not leave any `test.todo()` call (also see step 3 below).

3. After you're done with the test file, verify that the contents of the test file is OK:

```bash
$ pnpm test:specs --target <target_file>
# ...it should not output any errors
```

## Steps for re-generating a test file section

So you've changed a prop/method/...etc on a Component/Directive/...etc and you've edited its JSON file (if it has one). Now the Specs script will not output any error since no tests are missing in the respective test file. But you can re-generate the test file section(s) where changes need to be made by targeting them:

1. Run the Specs script so it can generate the missing pieces for you for each of the sections:

```bash
$ pnpm test:specs --interactive --target <target_file> --generate <json_root_prop>.<json_subprop>
# ...and it will output how the section should look like

# Examples:
#   $ pnpm test:specs -i -t QBtn -g props.label
#   $ pnpm test:specs -i -t QBtn -g events.click
#   $ pnpm test:specs -i -t QBtn -g "events.update:model-value"
#   $ pnpm test:specs -i -t QBtn -g methods.click
```

For NON component/directive/plugin files (so composables or other generic js files), there is no JSON (composables may have a JSON but it does not refer to the explicit exported content of the file so it is ignored), but the Specs script can still infer the contents and generate the missing pieces for you:

```bash
# target the default exporting function
$ pnpm test:specs -i -t set-css-var -g functions.default

# target the default exporting object:
$ pnpm test:specs -i -t set-css-var -g variables.default

# target the default exporting class:
$ pnpm test:specs -i -t EventBus -g classes.default

# target a named exported variable
$ pnpm test:specs -i -t set-css-var -g variables.useSizeDefaults

# target a named exported class
$ pnpm test:specs -i -t set-css-var -g classes.myClassName

# target a named exported function
$ pnpm test:specs -i -t global-nodes -g functions.createGlobalNode
```

2. The content that gets outputted to the terminal is automatically copied to the clipboard. Should you need just a part of it, just copy that part only. Should you copy the whole output, remember to not remove `.todo` from the `test.todo()` calls.

3. After you're done with the test file, verify that the contents of the test file is OK:

```bash
$ pnpm test:specs --target <target_file>
# ...it should not output any errors
```

## License

Copyright (c) 2015-present Razvan Stoenescu

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
