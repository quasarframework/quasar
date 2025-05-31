// Parameter mappings for app-extension template
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
