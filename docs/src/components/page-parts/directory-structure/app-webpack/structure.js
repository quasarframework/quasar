export default {
  label: '.',
  children: [
    {
      label: 'public/',
      comment: 'Pure static assets (directly copied)'
    },
    {
      label: 'src/',
      children: [
        {
          label: 'assets/',
          comment: 'Dynamic assets (processed by Webpack)'
        },
        {
          label: 'components/',
          comment: '.vue components used in pages & layouts'
        },
        {
          label: 'css/',
          comment: 'CSS/Sass/... files for your app',
          children: [
            {
              label: 'app.sass'
            },
            {
              label: 'quasar.variables.sass',
              comment: 'Quasar Sass variables for you to tweak'
            }
          ]
        },
        {
          label: 'layouts/',
          comment: 'Layout .vue files'
        },
        {
          label: 'pages/',
          comment: 'Page .vue files'
        },
        {
          label: 'boot/',
          comment: 'Boot files (app initialization code)'
        },
        {
          label: 'router/',
          comment: 'Vue Router',
          children: [
            {
              label: 'index.js',
              comment: 'Vue Router definition'
            },
            {
              label: 'routes.js',
              comment: 'App Routes definitions'
            }
          ]
        },
        {
          label: 'stores/',
          comment: 'Pinia Stores (if not using Vuex)',
          children: [
            {
              label: 'index.js',
              comment: 'Pinia initialization'
            },
            {
              label: '<store>',
              comment: 'Pinia stores...'
            },
            {
              label: '<store>...'
            }
          ]
        },
        {
          label: 'store/',
          comment: 'Vuex Store (if not using Pinia)',
          children: [
            {
              label: 'index.js',
              comment: 'Vuex Store definition'
            },
            {
              label: '<folder>',
              comment: 'Vuex Store Module..'
            },
            {
              label: '<folder>',
              comment: 'Vuex Store Module..'
            }
          ]
        },
        {
          label: 'App.vue',
          comment: 'Root Vue component of your App'
        },
        {
          label: 'index.template.html',
          comment: 'Template for index.html'
        }
      ]
    },
    {
      label: 'src-ssr/',
      comment: 'SSR specific code (like production Node webserver)'
    },
    {
      label: 'src-pwa/',
      comment: 'PWA specific code (like Service Worker)'
    },
    {
      label: 'src-cordova/',
      comment: 'Cordova generated folder used to create Mobile Apps'
    },
    {
      label: 'src-electron/',
      comment: 'Electron specific code (like "main" thread)'
    },
    {
      label: 'src-bex/',
      comment: 'BEX (browser extension) specific code (like "main" thread)'
    },
    {
      label: 'dist/',
      comment: 'Where production builds go',
      children: [
        {
          label: 'spa',
          comment: 'Example when building SPA'
        },
        {
          label: 'ssr',
          comment: 'Example when building SSR'
        },
        {
          label: 'electron',
          comment: 'Example when building Electron'
        },
        {
          label: '...'
        }
      ]
    },
    {
      label: 'quasar.config.js',
      comment: 'Quasar App Config file'
    },
    {
      label: 'babel.config.js',
      comment: 'Babeljs config'
    },
    {
      label: '.editorconfig',
      comment: 'EditorConfig file'
    },
    {
      label: '.eslintignore',
      comment: 'ESLint ignore paths'
    },
    {
      label: '.eslintrc.js',
      comment: 'ESLint config'
    },
    {
      label: '.postcssrc.js',
      comment: 'PostCSS config'
    },
    {
      label: 'jsconfig.json',
      comment: 'Editor config (if not using TypeScript)'
    },
    {
      label: 'tsconfig.json',
      comment: 'TypeScript config'
    },
    {
      label: '.gitignore',
      comment: 'GIT ignore paths'
    },
    {
      label: 'package.json',
      comment: 'npm scripts and dependencies'
    },
    {
      label: 'README.md',
      comment: 'Readme for your website/App'
    }
  ]
}
