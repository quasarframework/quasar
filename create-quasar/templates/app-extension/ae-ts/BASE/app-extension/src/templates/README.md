<% /* TODO: Consider reworking the AE docs and moving this to the docs */ %>
# Templates

Use this directory to store the templates that will be scaffolded during AE installation. You can organize the templates in subdirectories to copy them as groups as needed.

Examples:
- If there are files that are always needed, put them in a subdirectory called `base`.
- Group them by features and have a `templates/components` directory to scaffold components, a `templates/pages` directory to scaffold pages, etc. only if the user chooses the respective options in the prompts.
- Group templates by the TS and non-TS versions of the files, e.g. `templates/typescript` and `templates/no-typescript`.

You can combine the above examples or create more directories as needed.

## Rendering templates

Use the Install API ([`src/install.ts`](../install.ts)) to render the templates. The API provides a `render` method that takes the path to the template and the scope object to render the template with.

```ts
api.render('./templates/base');
// Render with scope set to the prompts object
api.render('./templates/base', api.prompts);
// Render with a custom scope object
api.render('./templates/base', { someVar: 'someValue', anotherVar: api.prompts.whatever === 'foo' });

// Render a different template based on the host project having TypeScript or not
const type = await api.hasTypescript() ? 'typescript' : 'no-typescript';
api.render(`./templates/${type}`);
```
