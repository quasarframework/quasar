const options = [
  {
    name: 'Vue Prototype Injections',
    path: 'vue-prototype-injections'
  },
  {
    name: 'Quasar Languages',
    path: 'quasar-languages'
  },
  {
    name: 'Internationalization',
    path: 'internationalization'
  },
  {
    name: 'Installing Icon Libraries',
    path: 'installing-icon-libraries'
  },
  {
    name: 'Quasar Icon Sets',
    path: 'icons'
  },
  {
    name: 'RTL Support',
    path: 'rtl-support'
  },
  {
    name: 'Platform Detection',
    path: 'platform-detection'
  },
  {
    name: 'Screen Plugin',
    path: 'screen-plugin'
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
        name: 'Typography',
        path: 'typography'
      }
    ]
  },
  {
    name: 'CSS Helpers & Grid',
    path: 'css-helpers',
    children: [
      {
        name: 'Spacing',
        path: 'spacing'
      },
      {
        name: 'Flex CSS / Grid',
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
      },
      {
        name: 'Animation CSS Helper Classes',
        path: 'animation-css-helper-classes'
      }
    ]
  },
  {
    name: 'Global Event Bus',
    path: 'global-event-bus'
  }
]

const directives = [
  {
    name: 'Close Dialog',
    path: 'close-dialog'
  },
  {
    name: 'Close Menu',
    path: 'close-menu'
  },
  {
    name: '(Navigation) Go Back',
    path: 'go-back'
  },
  {
    name: '(Material) Ripple',
    path: 'material-ripple'
  },
  {
    name: 'Scroll',
    path: 'scroll'
  },
  {
    name: 'Scroll Fire',
    path: 'scroll-fire'
  },
  {
    name: 'Touch Hold',
    path: 'touch-hold'
  },
  {
    name: 'Touch Pan',
    path: 'touch-pan'
  },
  {
    name: 'Touch Repeat',
    path: 'touch-repeat'
  },
  {
    name: 'Touch Swipe',
    path: 'touch-swipe'
  }
]

const plugins = [
  {
    name: 'Addressbar Color',
    path: 'addressbar-color'
  },
  {
    name: 'App Fullscreen',
    path: 'app-fullscreen'
  },
  {
    name: 'App Visibility',
    path: 'app-visibility'
  },
  {
    name: 'Bottom Sheet',
    path: 'bottom-sheet'
  },
  {
    name: 'Cookies',
    path: 'cookies'
  },
  {
    name: 'Dialog',
    path: 'dialog'
  },
  {
    name: 'Loading',
    path: 'loading'
  },
  {
    name: 'Loading Bar',
    path: 'loading-bar'
  },
  {
    name: 'Local/Session Storage',
    path: 'web-storage'
  },
  {
    name: 'Meta',
    path: 'meta'
  },
  {
    name: 'Notify',
    path: 'notify'
  }
]

const components = [
  {
    name: 'Action Sheet',
    path: 'action-sheet'
  },
  {
    name: 'Ajax Bar',
    path: 'ajax-bar'
  },
  {
    name: 'Avatar',
    path: 'avatar'
  },
  {
    name: 'Badge',
    path: 'badge'
  },
  {
    name: 'Banner',
    path: 'banner'
  },
  {
    name: 'Bar',
    path: 'bar'
  },
  {
    name: 'Breadcrumbs',
    path: 'breadcrumbs'
  },
  {
    name: 'Buttons',
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
    name: 'Card',
    path: 'card'
  },
  {
    name: 'Carousel',
    path: 'carousel'
  },
  {
    name: 'Chat Message',
    path: 'chat'
  },
  {
    name: 'Chip',
    path: 'chip'
  },
  {
    name: 'Circular Progress',
    path: 'circular-progress'
  },
  {
    name: 'Color Picker',
    path: 'color-picker'
  },
  {
    name: 'Dialog',
    path: 'dialog'
  },
  {
    name: 'Editor - WYSIWYG',
    path: 'editor'
  },
  {
    name: 'Expansion Item',
    path: 'expansion-item'
  },
  {
    name: 'Form Components',
    children: [
      {
        name: 'Input Textfield',
        path: 'input'
      },
      {
        name: 'Form Mask',
        path: 'form-mask'
      },
      {
        name: 'Form Validation',
        path: 'form-validation'
      },
      {
        name: 'Select',
        path: 'select'
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
        name: 'Slider',
        path: 'slider'
      },
      {
        name: 'Range',
        path: 'range'
      },
      {
        name: 'Time Picker',
        path: 'time'
      },
      {
        name: 'Date Picker',
        path: 'date'
      }
    ]
  },
  {
    name: 'Icon',
    path: 'icon'
  },
  {
    name: 'Img',
    path: 'img'
  },
  {
    name: 'Infinite Scroll',
    path: 'infinite-scroll'
  },
  {
    name: 'Inner Loading',
    path: 'inner-loading'
  },
  {
    name: 'Knob',
    path: 'knob'
  },
  {
    name: 'Linear Progress',
    path: 'linear-progress'
  },
  {
    name: 'List & List Items',
    path: 'list-and-list-items'
  },
  {
    name: 'Markup Table',
    path: 'markup-table'
  },
  {
    name: 'Menu',
    path: 'menu'
  },
  {
    name: 'Modal',
    path: 'modal'
  },
  {
    name: 'No SSR',
    path: 'no-ssr'
  },
  {
    name: 'Observers',
    children: [
      {
        name: 'Element Resize Observer',
        path: 'element-resize-observer'
      },
      {
        name: 'Window Resize Observer',
        path: 'window-resize-observer'
      }
    ]
  },
  {
    name: 'Pagination',
    path: 'pagination'
  },
  {
    name: 'Parallax',
    path: 'parallax'
  },
  {
    name: 'Popup Edit',
    path: 'popup-edit'
  },
  {
    name: 'Popup Proxy',
    path: 'popup-proxy'
  },
  {
    name: 'Pull To Refresh',
    path: 'pull-to-refresh'
  },
  {
    name: 'Rating',
    path: 'rating'
  },
  {
    name: 'Separator',
    path: 'separator'
  },
  {
    name: 'Slide Item',
    path: 'slide-item'
  },
  {
    name: 'Space',
    path: 'space'
  },
  {
    name: 'Spinners',
    path: 'spinners'
  },
  {
    name: 'Splitter',
    path: 'splitter'
  },
  {
    name: 'Stepper',
    path: 'stepper'
  },
  {
    name: 'Table',
    path: 'table'
  },
  {
    name: 'Tabs',
    path: 'tabs'
  },
  {
    name: 'Timeline',
    path: 'timeline'
  },
  {
    name: 'Toolbar',
    path: 'toolbar'
  },
  {
    name: 'Tooltip',
    path: 'tooltip'
  },
  {
    name: 'Transitions',
    children: [
      {
        name: 'Transition',
        path: 'transition'
      },
      {
        name: 'Slide Transition',
        path: 'slide-transition'
      }
    ]
  },
  {
    name: 'Tree',
    path: 'tree'
  },
  {
    name: 'Uploader',
    path: 'uploader'
  },
  {
    name: 'Video',
    path: 'video'
  }
]

const cli = [
  {
    name: 'Installation',
    path: 'installation'
  },
  {
    name: 'CLI Documentation',
    path: 'cli-documentation',
    children: [
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
    name: 'Ajax Requests',
    path: 'ajax-requests'
  },
  {
    name: 'Opening Dev Server To Public',
    path: 'opening-dev-server-to-public'
  }
]

export default [
  {
    name: 'Introduction to Quasar',
    icon: 'room',
    path: 'introduction-to-quasar'
  },
  {
    name: 'Sponsors and Backers',
    icon: 'favorite',
    path: 'sponsors-and-backers'
  },
  {
    name: 'Getting Started',
    icon: 'flight_takeoff',
    path: 'getting-started',
    children: [
      {
        name: 'Pick Quasar Flavour',
        path: 'pick-quasar-flavour'
      },
      {
        name: 'How to use Vue',
        path: 'how-to-use-vue'
      },
      {
        name: 'Contribution Guide',
        path: 'contribution-guide'
      },
      {
        name: 'Quasar Flavours',
        opened: true,
        children: [
          {
            name: 'Quasar CLI',
            path: 'quasar-cli'
          },
          {
            name: 'UMD / Standalone',
            path: 'umd'
          },
          {
            name: 'Vue CLI Plugin',
            path: 'vue-cli-plugin'
          }
        ]
      }
    ]
  },
  {
    name: 'Quasar Options & Helpers',
    icon: 'tune',
    path: 'options-and-helpers',
    children: options
  },
  {
    name: 'Layout',
    icon: 'view_quilt',
    path: 'vue-components',
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
        name: 'Page Scroller',
        path: 'page-scroller'
      },
      {
        name: 'Floating Action Button',
        path: 'floating-action-button'
      }
    ]
  },
  {
    name: 'Vue Components',
    icon: 'widgets',
    path: 'vue-components',
    children: components
  },
  {
    name: 'Vue Directives',
    icon: 'swap_calls',
    path: 'vue-directives',
    children: directives
  },
  {
    name: 'Quasar Plugins',
    icon: 'extension',
    path: 'quasar-plugins',
    children: plugins
  },
  {
    name: 'Quasar Utils',
    icon: 'healing',
    path: 'quasar-utils',
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
    name: 'Quasar CLI',
    icon: 'build',
    path: 'quasar-cli',
    children: cli
  }
]
