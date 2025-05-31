// Parameter mappings for ui-kit template
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
