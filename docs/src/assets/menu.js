export default [
  {
    name: 'Introduction to Quasar',
    path: 'introduction'
  },
  {
    name: 'Getting Started',
    path: 'getting-started'
  },
  {
    name: 'Playground',
    path: 'playground'
  },
  {
    name: 'Misc',
    path: 'misc',
    children: [
      {
        name: 'Contribution Guide',
        path: 'contribution-guide'
      },
      {
        name: 'Ajax Requests',
        path: 'ajax-requests'
      },
      {
        name: 'Opening Dev Server To Public',
        path: 'opening-dev-server-to-public'
      }
    ]
  },
  {
    name: 'UMD / Standalone',
    path: 'umd'
  },
  {
    name: 'Vue CLI Plugin',
    path: 'vue-cli-plugin'
  },
  {
    name: 'Quasar CLI',
    path: 'quasar-cli',
    children: [
      {
        name: 'Installation',
        path: 'installation'
      },
      {
        name: 'Directory Structure',
        path: 'directory-structure'
      },
      {
        name: 'Quasar.conf.js',
        path: 'quasar-conf-js'
      },
      {
        name: 'Build Commands',
        path: 'build-commands'
      },
      {
        name: 'Routing',
        path: 'routing'
      },
      {
        name: 'Adding Pages and Layouts',
        path: 'adding-pages-and-layouts'
      },
      {
        name: 'Lazy Loading - Code Splitting',
        path: 'lazy-loading'
      },
      {
        name: 'Handling Assets',
        path: 'handling-assets'
      },
      {
        name: 'App Plugins',
        path: 'app-plugins'
      },
      {
        name: 'Prefetch Feature',
        path: 'prefetch-feature'
      },
      {
        name: 'API Proxying',
        path: 'api-proxying'
      },
      {
        name: 'Pre-Processors with Webpack',
        path: 'preprocessors-with-webpack'
      },
      {
        name: 'Vuex Store',
        path: 'vuex-store'
      },
      {
        name: 'Theming',
        path: 'theming'
      },
      {
        name: 'Linter',
        path: 'linter'
      },
      {
        name: 'Supporting IE',
        path: 'supporting-ie'
      },
      {
        name: 'Deploying SPA',
        path: 'deploying-spa'
      }
    ]
  },
  {
    name: 'Developing SSR',
    path: 'developing-ssr',
    children: [
      {
        name: 'Introduction',
        path: 'introduction'
      },
      {
        name: 'Writing Universal Code',
        path: 'writing-universal-code'
      },
      {
        name: 'Configuring SSR',
        path: 'configuring-ssr'
      },
      {
        name: 'Client Side Hydration',
        path: 'client-side-hydration'
      },
      {
        name: 'Handling 404 and 500 Errors',
        path: 'handling-404-and-500-errors'
      },
      {
        name: 'SSR with PWA',
        path: 'ssr-with-pwa'
      },
      {
        name: 'SSR Frequently Asked Questions',
        path: 'ssr-frequently-asked-questions'
      },
      {
        name: 'Build Commands',
        path: 'build-commands'
      },
      {
        name: 'Deploying',
        path: 'deploying'
      }
    ]
  },
  {
    name: 'Developing PWA',
    path: 'developing-pwa',
    children: [
      {
        name: 'Introduction',
        path: 'introduction'
      },
      {
        name: 'Configuring PWA',
        path: 'configuring-pwa'
      },
      {
        name: 'Build Commands',
        path: 'build-commands'
      }
    ]
  },
  {
    name: 'Developing Mobile Apps',
    path: 'developing-mobile-apps',
    children: [
      {
        name: 'Introduction',
        path: 'introduction'
      },
      {
        name: 'Preparation',
        path: 'preparation'
      },
      {
        name: 'Configuring Cordova',
        path: 'configuring-cordova'
      },
      {
        name: 'Cordova Plugins',
        path: 'cordova-plugins'
      },
      {
        name: 'Build Commands',
        path: 'build-commands'
      },
      {
        name: 'Troubleshooting and Tips',
        path: 'troubleshooting-and-tips'
      },
      {
        name: 'Managing Google Analytics',
        path: 'managing-google-analytics'
      },
      {
        name: 'Publishing to Store',
        path: 'publishing-to-store'
      }
    ]
  },
  {
    name: 'Developing Electron Apps',
    path: 'developing-electron-apps',
    children: [
      {
        name: 'Introduction',
        path: 'introduction'
      },
      {
        name: 'Preparation',
        path: 'preparation'
      },
      {
        name: 'Configuring Electron',
        path: 'configuring-electron'
      },
      {
        name: 'Electron Packages',
        path: 'electron-packages'
      },
      {
        name: 'Build Commands',
        path: 'build-commands'
      },
      {
        name: 'Electron Static Assets',
        path: 'electron-static-assets'
      },
      {
        name: 'Troubleshooting and Tips',
        path: 'troubleshooting-and-tips'
      }
    ]
  },
  {
    name: 'Components',
    path: 'components',
    children: [
      {
        name: 'Introduction for Beginners',
        path: 'introduction-for-begginers'
      },
      {
        name: 'Platform Detection',
        path: 'platform-detection'
      },
      {
        name: 'Global Event Bus',
        path: 'global-event-bus'
      },
      {
        name: 'Vue Prototype Injections',
        path: 'vue-prototype-injections'
      },
      {
        name: 'Internationalization (I18n)',
        path: 'internationalization'
      },
      {
        name: 'RTL Support',
        path: 'rtl-support'
      },
      {
        name: 'Screen Plugin',
        path: 'screen-plugin'
      },
      {
        name: 'Meta Plugin',
        path: 'meta-plugin'
      },
      {
        name: 'Style & Identity',
        path: 'style-and-identity',
        children: [
          {
            name: 'Color Palette',
            path: 'color-palette'
          },
          {
            name: 'Stylus Variables',
            path: 'stylus-variables'
          },
          {
            name: 'Icons',
            path: 'icons'
          },
          {
            name: 'Typography',
            path: 'typography'
          },
          {
            name: 'Addressbar Color',
            path: 'addressbar-color'
          },
          {
            name: 'Material Ripples',
            path: 'material-ripples'
          }
        ]
      },
      {
        name: 'CSS Helpers',
        path: 'css-helpers',
        children: [
          {
            name: 'Spacing',
            path: 'spacing'
          },
          {
            name: 'Flex CSS',
            path: 'flex-css'
          },
          {
            name: 'Shadows',
            path: 'shadows'
          },
          {
            name: 'Visibility',
            path: 'visibility'
          },
          {
            name: 'Positioning',
            path: 'positioning'
          },
          {
            name: 'Other Helper Classes',
            path: 'other-helper-classes'
          }
        ]
      },
      {
        name: 'Layout',
        path: 'layout',
        children: [
          {
            name: 'Layout',
            path: 'layout'
          },
          {
            name: 'Integrating Layout with Router',
            path: 'integrating-layout-with-router'
          },
          {
            name: 'Layout Header and Footer',
            path: 'header-and-footer'
          },
          {
            name: 'Layout Drawer',
            path: 'drawer'
          },
          {
            name: 'Layout Page',
            path: 'page'
          },
          {
            name: 'Page Sticky',
            path: 'page-sticky'
          },
          {
            name: 'Floating Action Button',
            path: 'floating-action-button'
          },
          {
            name: 'Element Resize Observable',
            path: 'element-resize-observable'
          },
          {
            name: 'Window Resize Observable',
            path: 'window-resize-observable'
          }
        ]
      },
      {
        name: 'Buttons',
        path: 'buttons',
        children: [
          {
            name: 'Button',
            path: 'button'
          },
          {
            name: 'Button Group',
            path: 'button-group'
          },
          {
            name: 'Button Dropdown',
            path: 'button-dropdown'
          }
        ]
      },
      {
        name: 'Navigation',
        path: 'navigation',
        children: [
          {
            name: 'Toolbar',
            path: 'toolbar'
          },
          {
            name: 'Tabs',
            path: 'tabs'
          },
          {
            name: 'Pull to Refresh',
            path: 'pull-to-refresh'
          },
          {
            name: 'Handling Back Button',
            path: 'handling-back-button'
          },
          {
            name: 'Breadcrumbs',
            path: 'breadcrumbs'
          },
          {
            name: 'Pagination',
            path: 'pagination'
          }
        ]
      },
      {
        name: 'Form Components',
        path: 'form',
        children: [
          {
            name: 'Field',
            path: 'field'
          },
          {
            name: 'Input Textfield',
            path: 'input-textfield'
          },
          {
            name: 'Form Validation',
            path: 'form-validation'
          },
          {
            name: 'Chips Input',
            path: 'chips-input'
          },
          {
            name: 'Color Input',
            path: 'color-input'
          },
          {
            name: 'Color Picker',
            path: 'color-picker'
          },
          {
            name: 'Autocomplete',
            path: 'autocomplete'
          },
          {
            name: 'Editor - WYSIWYG',
            path: 'editor'
          },
          {
            name: 'Search',
            path: 'search'
          },
          {
            name: 'Slider',
            path: 'slider'
          },
          {
            name: 'Range',
            path: 'range'
          },
          {
            name: 'Radio',
            path: 'radio'
          },
          {
            name: 'Checkbox',
            path: 'checkbox'
          },
          {
            name: 'Toggle',
            path: 'toggle'
          },
          {
            name: 'Button Toggle',
            path: 'button-toggle'
          },
          {
            name: 'Option Group',
            path: 'option-group'
          },
          {
            name: 'Datetime Input',
            path: 'datetime-input'
          },
          {
            name: 'Datetime Picker',
            path: 'datetime-picker'
          },
          {
            name: 'Select',
            path: 'select'
          },
          {
            name: 'Rating',
            path: 'rating'
          },
          {
            name: 'Knob',
            path: 'knob'
          },
          {
            name: 'Uploader',
            path: 'uploader'
          }
        ]
      },
      {
        name: 'Grouping',
        path: 'grouping',
        children: [
          {
            name: 'Card',
            path: 'card'
          },
          {
            name: 'Collapsible',
            path: 'collapsible'
          },
          {
            name: 'DataTable',
            path: 'datatable'
          },
          {
            name: 'List and List Items',
            path: 'list-and-list-items'
          },
          {
            name: 'Stepper',
            path: 'stepper'
          },
          {
            name: 'Tree',
            path: 'tree'
          }
        ]
      },
      {
        name: 'Popups',
        path: 'popups',
        children: [
          {
            name: 'Action Sheet',
            path: 'action-sheet'
          },
          {
            name: 'Dialog',
            path: 'dialog'
          },
          {
            name: 'Modal',
            path: 'modal'
          },
          {
            name: 'Notify',
            path: 'notify'
          },
          {
            name: 'Popover',
            path: 'popover'
          },
          {
            name: 'Tooltip',
            path: 'tooltip'
          }
        ]
      },
      {
        name: 'Progress',
        path: 'progress',
        children: [
          {
            name: 'Ajax Bar',
            path: 'ajax-bar'
          },
          {
            name: 'Loading Bar',
            path: 'loading-bar'
          },
          {
            name: 'Inner Loading',
            path: 'inner-loading'
          },
          {
            name: 'Progress Bar',
            path: 'progress-bar'
          },
          {
            name: 'Loading',
            path: 'loading'
          },
          {
            name: 'Spinners',
            path: 'spinners'
          }
        ]
      },
      {
        name: 'Media',
        path: 'media',
        children: [
          {
            name: 'Carousel',
            path: 'carousel'
          },
          {
            name: 'Parallax',
            path: 'parallax'
          },
          {
            name: 'Video Embedding',
            path: 'video-embedding'
          }
        ]
      },
      {
        name: 'Scrolling',
        path: 'scrolling',
        children: [
          {
            name: 'Scroll Observable',
            path: 'scroll-observable'
          },
          {
            name: 'Scroll Directive',
            path: 'scroll-directive'
          },
          {
            name: 'Infinite Scroll',
            path: 'infinite-scroll'
          },
          {
            name: 'Scroll Area',
            path: 'scroll-area'
          },
          {
            name: 'Scroll Fire',
            path: 'scroll-fire'
          },
          {
            name: 'Back to Top',
            path: 'back-to-top'
          },
          {
            name: 'Scrolling Utils',
            path: 'scrolling-utils'
          }
        ]
      },
      {
        name: 'Animation',
        path: 'animation',
        children: [
          {
            name: 'Transition',
            path: 'transition'
          },
          {
            name: 'Slide Transition',
            path: 'slide-transition'
          },
          {
            name: 'JS Animations',
            path: 'js-animations'
          },
          {
            name: 'Animation CSS Helper Classes',
            path: 'animation-css-helper-classes'
          }
        ]
      },
      {
        name: 'Other Components',
        path: 'other-components',
        children: [
          {
            name: 'Alert',
            path: 'alert'
          },
          {
            name: 'Chip',
            path: 'chip'
          },
          {
            name: 'Chat',
            path: 'chat'
          },
          {
            name: 'Jumbotron',
            path: 'jumbotron'
          },
          {
            name: 'NoSsr',
            path: 'no-ssr'
          },
          {
            name: 'Timeline',
            path: 'timeline'
          }
        ]
      },
      {
        name: 'Touch/Mouse Actions',
        path: 'touch-mouse-actions',
        children: [
          {
            name: 'Touch Pan',
            path: 'touch-pan'
          },
          {
            name: 'Touch Swipe',
            path: 'touch-swipe'
          },
          {
            name: 'Touch Hold',
            path: 'touch-hold'
          }
        ]
      },
      {
        name: 'Utils',
        path: 'utils',
        children: [
          {
            name: 'Date Utils',
            path: 'date-utils'
          },
          {
            name: 'Color Utils',
            path: 'color-utils'
          },
          {
            name: 'DOM Utils',
            path: 'dom-utils'
          },
          {
            name: 'Formatter Utils',
            path: 'formatter-utils'
          },
          {
            name: 'Other Utils',
            path: 'other-utils'
          }
        ]
      },
      {
        name: 'Web API Wrappers',
        path: 'web-api-wrappers',
        children: [
          {
            name: 'Cookies',
            path: 'cookies'
          },
          {
            name: 'Web Storage',
            path: 'web-storage'
          },
          {
            name: 'App Visibility',
            path: 'app-visibility'
          },
          {
            name: 'App Fullscreen',
            path: 'app-fullscreen'
          }
        ]
      }
    ]
  }
]
