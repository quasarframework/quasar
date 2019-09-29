const contributionGuide = [
  {
    name: 'Contribution Guide',
    path: 'contribution-guide'
  },
  {
    name: 'Running Projects',
    path: 'running-projects',
    badge: 'new'
  },
  {
    name: 'Start a New Project',
    path: 'new-project',
    badge: 'new'
  },
  {
    name: 'Project Maintainer Role',
    path: 'project-maintainer',
    badge: 'new'
  },
  {
    name: 'Commit Conventions',
    path: 'commit-conventions',
    badge: 'new'
  }
]

const gettingStarted = [
  {
    name: 'Pick Quasar Flavour',
    path: 'pick-quasar-flavour'
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
  },
  {
    name: 'How to use Vue',
    path: 'how-to-use-vue'
  },
  {
    name: 'Playground',
    path: 'playground'
  },
  {
    name: 'Release notes',
    badge: 'updated',
    path: 'release-notes'
  },
  {
    name: 'Roadmap',
    path: 'roadmap'
  },
  {
    name: 'Upgrade guide',
    path: 'upgrade-guide'
  },
  {
    name: 'VS Code Configuration',
    badge: 'new',
    path: 'vs-code-configuration'
  }
]

const options = [
  {
    name: 'Vue Prototype Injections',
    path: 'vue-prototype-injections'
  },
  {
    name: 'App Icons',
    path: 'app-icons'
  },
  {
    name: 'SEO',
    path: 'seo'
  },
  {
    name: 'Quasar Language Packs',
    path: 'quasar-language-packs'
  },
  {
    name: 'App Internationalization',
    path: 'app-internationalization'
  },
  {
    name: 'RTL Support',
    path: 'rtl-support'
  },
  {
    name: 'Installing Icon Libraries',
    path: 'installing-icon-libraries'
  },
  {
    name: 'Quasar Icon Sets',
    path: 'quasar-icon-sets'
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
    name: 'Animations',
    path: 'animations'
  },
  {
    name: 'Transitions',
    path: 'transitions'
  },
  {
    name: 'Global Event Bus',
    path: 'global-event-bus'
  }
]

const security = [
  {
    name: `DO's and DON'Ts`,
    path: 'dos-and-donts'
  },
  {
    name: 'Report a vulnerability',
    path: 'report-a-vulnerability'
  },
  {
    name: 'Get help!',
    path: 'get-help'
  }
]

const cli = [
  {
    name: 'Installation',
    path: 'installation'
  },
  {
    name: 'quasar.conf.js',
    path: 'quasar-conf-js'
  },
  {
    name: 'App Icons',
    path: 'app-icons'
  },
  {
    name: 'Testing & Auditing',
    path: 'testing-and-auditing'
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
        name: 'Build Commands',
        path: 'build-commands'
      },
      {
        name: 'Commands List',
        path: 'commands-list'
      },
      {
        name: 'CSS Preprocessors',
        badge: 'new',
        path: 'css-preprocessors'
      },
      {
        name: 'Routing',
        path: 'routing'
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
        name: 'Boot Files',
        path: 'boot-files'
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
        name: 'Handling Webpack',
        path: 'handling-webpack'
      },
      {
        name: 'Handling process.env',
        path: 'handling-process-env'
      },
      {
        name: 'Vuex Store',
        path: 'vuex-store'
      },
      {
        name: 'Linter',
        path: 'linter'
      },
      {
        name: 'Supporting IE',
        path: 'supporting-ie'
      }
    ]
  },
  {
    name: 'Developing SPA',
    path: 'developing-spa',
    children: [
      {
        name: 'Introduction',
        path: 'introduction'
      },
      {
        name: 'App Icons for SPA',
        path: 'app-icons-spa'
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
        name: 'App Icons for SSR',
        path: 'app-icons-ssr'
      },
      {
        name: 'SEO for SSR',
        path: 'seo-for-ssr'
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
        name: 'App Icons for PWA',
        path: 'app-icons-pwa'
      },
      {
        name: 'Handling Service Worker',
        path: 'handling-service-worker'
      },
      {
        name: 'Build Commands',
        path: 'build-commands'
      }
    ]
  },
  {
    name: 'Developing Cordova Apps',
    path: 'developing-cordova-apps',
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
        name: 'App Icons for Cordova',
        path: 'app-icons-cordova'
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
        name: 'App Icons for Electron',
        path: 'app-icons-electron'
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
        name: 'Frameless Electron Window',
        path: 'frameless-electron-window'
      },
      {
        name: 'Electron Security Concerns',
        path: 'electron-security-concerns'
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

const style = [
  {
    name: 'Typography',
    path: 'typography'
  },
  {
    name: 'Color Palette',
    path: 'color-palette'
  },
  {
    name: 'Theme Builder',
    badge: 'new',
    path: 'theme-builder'
  },
  {
    name: 'Spacing',
    path: 'spacing'
  },
  {
    name: 'Shadows',
    path: 'shadows'
  },
  {
    name: 'Breakpoints',
    path: 'breakpoints'
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
    name: 'Sass/SCSS Variables',
    badge: 'new',
    path: 'sass-scss-variables'
  },
  {
    name: 'Stylus Variables',
    path: 'stylus-variables'
  },
  {
    name: 'Other Helper Classes',
    path: 'other-helper-classes'
  }
]

const layout = [
  {
    name: 'Flex Grid',
    path: 'grid',
    opened: true,
    children: [
      {
        name: 'Introduction to Flexbox',
        path: 'introduction-to-flexbox'
      },
      {
        name: 'Grid Row',
        path: 'row'
      },
      {
        name: 'Grid Column',
        path: 'column'
      },
      {
        name: 'Grid Gutter',
        path: 'gutter'
      },
      {
        name: 'Flex Playground',
        badge: 'new',
        path: 'flex-playground'
      }
    ]
  },
  {
    name: 'Layout',
    path: 'layout'
  },
  {
    name: 'Routing with Layouts and Pages',
    path: 'routing-with-layouts-and-pages'
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
    name: 'Layout Builder',
    badge: 'new',
    external: true,
    path: '/layout-builder'
  },
  {
    name: 'Layout Gallery',
    badge: 'new',
    path: 'gallery'
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

const directives = [
  {
    name: 'Close Popup',
    path: 'close-popup'
  },
  {
    name: 'Go Back (Handling Back Button)',
    path: 'go-back'
  },
  {
    name: 'Material Ripples',
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
    listPath: 'buttons',
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
    listPath: 'form-components',
    children: [
      {
        name: 'Input Textfield',
        path: 'input'
      },
      {
        name: 'Select',
        path: 'select'
      },
      {
        name: 'Form',
        path: 'form'
      },
      {
        name: 'Field (wrapper)',
        path: 'field'
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
    name: 'No SSR',
    path: 'no-ssr'
  },
  {
    name: 'Observers',
    listPath: 'observers',
    children: [
      {
        name: 'Resize Observer (for Element)',
        path: 'resize-observer'
      },
      {
        name: 'Scroll Observer',
        path: 'scroll-observer'
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
    name: 'Pull to refresh',
    path: 'pull-to-refresh'
  },
  {
    name: 'Rating',
    path: 'rating'
  },
  {
    name: 'Scroll Area',
    path: 'scroll-area'
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
    name: 'Slide Transition',
    path: 'slide-transition'
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
    name: 'Tab Panels',
    path: 'tab-panels'
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
  },
  {
    name: 'Virtual Scroll',
    badge: 'new',
    path: 'virtual-scroll'
  },
  {
    name: 'Zoom',
    badge: 'new',
    path: 'zoom'
  }
]

const appExtensions = [
  {
    name: 'Introduction',
    path: 'introduction'
  },
  {
    name: 'Discover App Extensions',
    path: 'discover'
  },
  {
    name: 'Development Guide',
    path: 'development-guide',
    opened: true,
    children: [
      {
        name: 'Introduction',
        path: 'introduction'
      },
      {
        name: 'Prompts API',
        path: 'prompts-api'
      },
      {
        name: 'Install API',
        path: 'install-api'
      },
      {
        name: 'Index API',
        path: 'index-api'
      },
      {
        name: 'Uninstall API',
        path: 'uninstall-api'
      }
    ]
  },
  {
    name: 'Tips and Tricks',
    path: 'tips-and-tricks',
    opened: true,
    children: [
      {
        name: 'Introduction',
        path: 'introduction'
      },
      {
        name: 'Provide a UI component',
        path: 'provide-a-ui-component'
      },
      {
        name: 'Provide a directive',
        path: 'provide-a-directive'
      },
      {
        name: 'Inject Quasar Plugin',
        path: 'inject-quasar-plugin'
      },
      {
        name: 'Starter kit equivalent',
        badge: 'new',
        path: 'starter-kit-equivalent'
      },
      {
        name: 'Chain Webpack',
        path: 'chain-webpack'
      }
    ]
  }
]

const utils = [
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
    name: 'Scrolling Utils',
    path: 'scrolling-utils'
  },
  {
    name: 'Other Utils',
    path: 'other-utils'
  }
]

module.exports = [
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
    name: 'Why Donations Are Important',
    icon: 'assignment_late',
    path: 'why-donate'
  },
  {
    name: 'Meet the Team',
    icon: 'people',
    path: 'meet-the-team'
  },
  {
    name: 'Contribution Guide',
    icon: 'code',
    path: 'contribution-guide',
    children: contributionGuide
  },
  {
    name: 'Getting Started',
    icon: 'flight_takeoff',
    path: 'start',
    children: gettingStarted
  },
  {
    name: 'Quasar Options & Helpers',
    icon: 'tune',
    path: 'options',
    children: options
  },
  {
    name: 'Security',
    icon: 'security',
    path: 'security',
    children: security
  },
  {
    name: 'Quasar CLI',
    icon: 'build',
    path: 'quasar-cli',
    children: cli
  },
  {
    name: 'Style & Identity',
    icon: 'style',
    path: 'style',
    children: style
  },
  {
    name: 'Layout and Grid',
    icon: 'view_quilt',
    path: 'layout',
    children: layout
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
    name: 'App Extensions',
    icon: 'note_add',
    path: 'app-extensions',
    children: appExtensions
  },
  {
    name: 'Quasar Utils',
    icon: 'healing',
    path: 'quasar-utils',
    children: utils
  }
]
