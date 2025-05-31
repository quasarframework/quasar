/**
 * Parameter mappings for ui-kit template
 * 
 * CONTRIBUTOR GUIDE:
 * ----------------
 * When adding new prompts to this template, follow these steps:
 * 1. Add a mapping from CLI parameter to prompt name in the paramMap object
 * 2. Add help text for the parameter in the helpText object
 * 3. Make sure the parameter name is kebab-case (e.g., 'features') for CLI
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
    'name': 'name',
    'license': 'license',
    'features': 'features',
    'package-description': 'packageDescription',
    'umd-export-name': 'umdExportName',
    'component-name': 'componentName',
    'directive-name': 'directiveName',
    'ae-description': 'aeDescription',
    'preset': 'preset'
  },
  
  // Help text for the parameters
  helpText: {
    'type': 'Project type (ui-kit)',
    'folder': 'Project folder name',
    'name': 'Project name (npm name, without "quasar-ui" prefix)',
    'license': 'License type (MIT, Apache-2.0, etc.)',
    'features': 'Features (comma-separated: component,directive,ae)',
    'package-description': 'Package description',
    'umd-export-name': 'UMD export name (global variable, camelCased)',
    'component-name': 'Component name (PascalCase)',
    'directive-name': 'Directive name (kebab-case, without "v-" prefix)',
    'ae-description': 'App Extension description',
    'preset': 'App Extension scripts (comma-separated: prompts,install,uninstall)'
  }
}
