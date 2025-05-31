// Parameter mappings for app template
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
