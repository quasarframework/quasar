/**
 * Parameter mappings for app-extension template
 * 
 * CONTRIBUTOR GUIDE:
 * ----------------
 * When adding new prompts to this template, follow these steps:
 * 1. Add a mapping from CLI parameter to prompt name in the paramMap object
 * 2. Add help text for the parameter in the helpText object
 * 3. Make sure the parameter name is kebab-case (e.g., 'need-org-name') for CLI
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
    'need-org-name': 'needOrgName',
    'org-name': 'orgName',
    'description': 'description',
    'license': 'license',
    'code-format': 'codeFormat',
    'preset': 'preset'
  },
  
  // Help text for the parameters
  helpText: {
    'type': 'Project type (app-extension)',
    'folder': 'Project folder name',
    'name': 'Quasar App Extension ext-id (without "quasar-app-extension" prefix)',
    'need-org-name': 'Use organization name (boolean)',
    'org-name': 'Organization name',
    'description': 'Project description',
    'license': 'License type (MIT, Apache-2.0, etc.)',
    'code-format': 'Code format (esm, commonjs)',
    'preset': 'Features preset (comma-separated: prompts,install,uninstall)'
  }
}
