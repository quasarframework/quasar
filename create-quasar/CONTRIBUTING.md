# Contributing to Quasar Create CLI

Thank you for your interest in contributing to the Quasar Create CLI tool! This guide will help you understand how the CLI parameter system works and how to extend it when adding or modifying templates and prompts.

## CLI Parameter System Overview

The Quasar Create CLI supports both interactive and non-interactive modes. The parameter system is designed to be:

1. **Modular**: Each template type manages its own parameters
2. **Extensible**: Easy to add new parameters or templates
3. **Dynamic**: Help text is generated based on template type
4. **Default-friendly**: Supports falling back to default values

## How Parameters Work

When a user runs the CLI with parameters, the following happens:

1. Command-line arguments are parsed by `minimist` in `index.js`
2. Arguments are passed to the `utils` module via `setCliArgs()`
3. Template-specific parameter mappings are loaded from `templates/<type>/params.js`
4. Parameters are mapped to prompt names and used to answer prompts
5. For non-interactive mode (`--yes` flag), default values are used for missing parameters

## Adding Parameters for New Templates or Prompts

If you're adding a new template or modifying an existing one with new prompts, follow these steps:

### 1. Update the Template's `params.js` File

Each template has a `params.js` file in its directory that defines:
- Parameter mappings (CLI parameter → prompt name)
- Help text for each parameter

```js
// Example: /templates/your-template/params.js
export default {
  // Parameter name: prompt name
  paramMap: {
    'type': 'type',
    'folder': 'folder',
    'your-param': 'yourPromptName',
    // Add your new parameters here
  },
  
  // Help text for the parameters
  helpText: {
    'type': 'Project type (your-template)',
    'folder': 'Project folder name',
    'your-param': 'Description of your parameter',
    // Add help text for your parameters here
  }
}
```

### 2. Handle Special Parameter Types

Different prompt types need special handling:

#### Text and Select Prompts

These work automatically. For `select` prompts, validation against choices is handled for you.

#### Multiselect Prompts

For multiselect prompts, values are passed as comma-separated strings:

```js
// CLI usage: --preset value1,value2,value3
```

The system automatically converts these to the format expected by the prompts.

#### Boolean Prompts

For boolean prompts (confirm type), you can pass `true`, `false`, or just the flag name:

```js
// All of these set the flag to true:
--your-boolean-flag
--your-boolean-flag true
--your-boolean-flag=true

// To set it to false explicitly:
--your-boolean-flag false
```

### 3. Conditional Prompts

If your prompt is conditional based on previous answers, the parameter system will handle this correctly. Just ensure your prompt's `type` function properly evaluates both interactive and non-interactive inputs:

```js
{
  type: (_, { previousAnswer } = {}) => (previousAnswer ? 'text' : null),
  name: 'conditionalPrompt',
  message: 'This only appears if previousAnswer is true'
}
```

### 4. Default Values

When using non-interactive mode with the `--yes` flag, the system uses default values for missing parameters:

- For `select` prompts, it uses the item with `selected: true` or the first item
- For `text` prompts, it uses the `initial` value
- For function-based values, it calls the function to get the default

Make sure your prompts have appropriate default values!

## Testing Your Parameters

Always test your parameters in both interactive and non-interactive modes:

```bash
# Test help for your template
node create-quasar/index.js --help --type your-template

# Test with specific parameters
node create-quasar/index.js --type your-template --your-param value

# Test non-interactive mode
node create-quasar/index.js --type your-template --yes
```

## Common Issues and Solutions

- **Parameter not working**: Check the mapping in your template's `params.js` file
- **Wrong default used**: Ensure default values are correctly set in the prompt definition
- **Conditional prompt not working**: Make sure the condition function handles both interactive and CLI inputs
- **Parameter validation failing**: Ensure CLI validation matches the interactive prompt validation

## Best Practices

1. **Keep help text clear and concise**, including expected values or format
2. **Document all parameters** in the template's `params.js` file
3. **Use consistent naming** between CLI parameters and prompt names
4. **Test all parameters** in both interactive and non-interactive modes
5. **Include example usage** in comments or documentation

By following these guidelines, you'll ensure that Quasar CLI maintains its excellent developer experience while being extensible for future needs.
