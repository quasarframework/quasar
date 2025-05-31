/**
 * Parameter mappings for app template
 * 
 * CONTRIBUTOR GUIDE:
 * ----------------
 * When adding new prompts to this template, follow these steps:
 * 1. Add a mapping from CLI parameter to prompt name in the paramMap object
 * 2. Add help text for the parameter in the helpText object
 * 3. Make sure the parameter name is kebab-case (e.g., 'script-type') for CLI
 * 4. Ensure the prompt name matches what's used in your prompts function
 * 5. Test both interactive and non-interactive modes
 * 
 * See /create-quasar/CONTRIBUTING.md for more details on the parameter system
 */
export default {
  // Parameter name: prompt name
  paramMap: {
    'type': 'type',
    'folder': 'folder',
    'package-manager': 'package-manager',
    'script-type': 'scriptType',
    'engine': 'engine',
    'name': 'name',
    'product-name': 'productName',
    'description': 'description',
    'sfc-style': 'sfcStyle',
    'css': 'css',
    'preset': 'preset',
    'prettier': 'prettier'
  },
  
  // Help text for the parameters
  helpText: {
    'type': 'Project type (app)',
    'folder': 'Project folder name',
    'script-type': 'Script type (js, ts)',
    'engine': 'Engine variant (vite-2, webpack-4)',
    'name': 'Package name',
    'product-name': 'Product name',
    'description': 'Project description',
    'preset': 'Features preset (comma-separated: eslint,pinia,axios,i18n)',
    'prettier': 'Add Prettier for code formatting (boolean)',
    'sfc-style': 'Vue component style (composition-setup, composition, options)',
    'css': 'CSS preprocessor (scss, sass, css)',
    'package-manager': 'Package manager to use (yarn, npm, pnpm, bun)'
  }
}
