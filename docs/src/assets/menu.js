const gettingStarted = [
  {
    name: 'Pick Quasar Flavour',
    path: 'pick-quasar-flavour',
    meta: {
      prev: '/sponsors-and-backers',
      next: 'how-to-use-vue'
    }
  },
  {
    name: 'How to use Vue',
    path: 'how-to-use-vue',
    meta: {
      prev: 'pick-quasar-flavour',
      next: 'contribution-guide'
    }
  },
  {
    name: 'Contribution Guide',
    path: 'contribution-guide',
    meta: {
      prev: 'how-to-use-vue',
      next: 'quasar-cli'
    }
  },
  {
    name: 'Quasar Flavours',
    opened: true,
    children: [
      {
        name: 'Quasar CLI',
        path: 'quasar-cli',
        meta: {
          prev: 'contribution-guide',
          next: 'umd'
        }
      },
      {
        name: 'UMD / Standalone',
        path: 'umd',
        meta: {
          prev: 'quasar-cli',
          next: 'vue-cli-plugin'
        }
      },
      {
        name: 'Vue CLI Plugin',
        path: 'vue-cli-plugin',
        meta: {
          prev: 'umd',
          next: '/options/vue-prototype-injections'
        }
      }
    ]
  }
]

const options = [
  {
    name: 'Vue Prototype Injections',
    path: 'vue-prototype-injections',
    meta: {
      prev: '/getting-started/vue-cli-plugin',
      next: 'quasar-language-packs'
    }
  },
  {
    name: 'Quasar Language Packs',
    path: 'quasar-language-packs',
    meta: {
      prev: 'vue-prototype-injections',
      next: 'app-internationalization'
    }
  },
  {
    name: 'App Internationalization',
    path: 'app-internationalization',
    meta: {
      prev: 'quasar-language-packs',
      next: 'rtl-support'
    }
  },
  {
    name: 'RTL Support',
    path: 'rtl-support',
    meta: {
      prev: 'app-internationalization',
      next: 'installing-icon-libraries'
    }
  },
  {
    name: 'Installing Icon Libraries',
    path: 'installing-icon-libraries',
    meta: {
      prev: 'rtl-support',
      next: 'quasar-icon-sets'
    }
  },
  {
    name: 'Quasar Icon Sets',
    path: 'quasar-icon-sets',
    meta: {
      prev: 'installing-icon-libraries',
      next: 'platform-detection'
    }
  },
  {
    name: 'Platform Detection',
    path: 'platform-detection',
    meta: {
      prev: 'quasar-icon-sets',
      next: 'screen-plugin'
    }
  },
  {
    name: 'Screen Plugin',
    path: 'screen-plugin',
    meta: {
      prev: 'platform-detection',
      next: 'animations'
    }
  },
  {
    name: 'Animations',
    path: 'animations',
    meta: {
      prev: 'screen-plugin',
      next: 'transitions'
    }
  },
  {
    name: 'Transitions',
    path: 'transitions',
    meta: {
      prev: 'animations',
      next: 'global-event-bus'
    }
  },
  {
    name: 'Global Event Bus',
    path: 'global-event-bus',
    meta: {
      prev: 'transitions',
      next: '/style/typography'
    }
  }
]

const style = [
  {
    name: 'Typography',
    path: 'typography',
    meta: {
      prev: '/options/global-event-bus',
      next: 'color-palette'
    }
  },
  {
    name: 'Color Palette',
    path: 'color-palette',
    meta: {
      prev: 'typography',
      next: 'theme-builder'
    }
  },
  {
    name: 'Theme Builder',
    path: 'theme-builder',
    badge: 'new',
    meta: {
      prev: 'color-palette',
      next: 'spacing'
    }
  },
  {
    name: 'Spacing',
    path: 'spacing',
    meta: {
      prev: 'theme-builder',
      next: 'shadows'
    }
  },
  {
    name: 'Shadows',
    path: 'shadows',
    meta: {
      prev: 'spacing',
      next: 'visibility'
    }
  },
  {
    name: 'Visibility',
    path: 'visibility',
    meta: {
      prev: 'shadows',
      next: 'positioning'
    }
  },
  {
    name: 'Positioning',
    path: 'positioning',
    meta: {
      prev: 'visibility',
      next: 'other-helper-classes'
    }
  },
  {
    name: 'Other Helper Classes',
    path: 'other-helper-classes',
    meta: {
      prev: 'positioning',
      next: '/layout/grid/introduction-to-flexbox'
    }
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
        path: 'introduction-to-flexbox',
        meta: {
          prev: '/style/other-helper-classes',
          next: 'row'
        }
      },
      {
        name: 'Grid Row',
        path: 'row',
        meta: {
          prev: 'introduction-to-flexbox',
          next: 'column'
        }
      },
      {
        name: 'Grid Column',
        path: 'column',
        meta: {
          prev: 'row',
          next: 'gutter'
        }
      },
      {
        name: 'Grid Gutter',
        path: 'gutter',
        meta: {
          prev: 'column',
          next: '/layout/layout'
        }
      }
    ]
  },
  {
    name: 'Layout',
    path: 'layout',
    meta: {
      prev: '/layout/grid/gutter',
      next: 'routing-with-layouts-and-pages'
    }
  },
  {
    name: 'Routing with Layouts and Pages',
    path: 'routing-with-layouts-and-pages',
    meta: {
      prev: 'layout',
      next: 'header-and-footer'
    }
  },
  {
    name: 'Layout Header and Footer',
    path: 'header-and-footer',
    meta: {
      prev: 'routing-with-layouts-and-pages',
      next: 'drawer'
    }
  },
  {
    name: 'Layout Drawer',
    path: 'drawer',
    meta: {
      prev: 'header-and-footer',
      next: 'page'
    }
  },
  {
    name: 'Layout Page',
    path: 'page',
    meta: {
      prev: 'drawer',
      next: 'page-sticky'
    }
  },
  {
    name: 'Page Sticky',
    path: 'page-sticky',
    meta: {
      prev: 'page',
      next: 'page-scroller'
    }
  },
  {
    name: 'Page Scroller',
    path: 'page-scroller',
    badge: 'new',
    meta: {
      prev: 'page-sticky',
      next: 'floating-action-button'
    }
  },
  {
    name: 'Floating Action Button',
    path: 'floating-action-button',
    meta: {
      prev: 'page-scroller',
      next: '/vue-components/ajax-bar'
    }
  }
]

const directives = [
  {
    name: 'Close Dialog',
    path: 'close-dialog',
    badge: 'new',
    meta: {
      prev: '/vue-components/video',
      next: 'close-menu'
    }
  },
  {
    name: 'Close Menu',
    path: 'close-menu',
    badge: 'new',
    meta: {
      prev: 'close-dialog',
      next: 'go-back'
    }
  },
  {
    name: 'Go Back (Handling Back Button)',
    path: 'go-back',
    meta: {
      prev: 'close-menu',
      next: 'material-ripple'
    }
  },
  {
    name: 'Material Ripples',
    path: 'material-ripple',
    meta: {
      prev: 'go-back',
      next: 'scroll'
    }
  },
  {
    name: 'Scroll',
    path: 'scroll',
    meta: {
      prev: 'material-ripple',
      next: 'scroll-fire'
    }
  },
  {
    name: 'Scroll Fire',
    path: 'scroll-fire',
    meta: {
      prev: 'scroll',
      next: 'touch-hold'
    }
  },
  {
    name: 'Touch Hold',
    path: 'touch-hold',
    meta: {
      prev: 'scroll-fire',
      next: 'touch-pan'
    }
  },
  {
    name: 'Touch Pan',
    path: 'touch-pan',
    meta: {
      prev: 'touch-hold',
      next: 'touch-repeat'
    }
  },
  {
    name: 'Touch Repeat',
    path: 'touch-repeat',
    badge: 'new',
    meta: {
      prev: 'touch-pan',
      next: 'touch-swipe'
    }
  },
  {
    name: 'Touch Swipe',
    path: 'touch-swipe',
    meta: {
      prev: 'touch-repeat',
      next: '/quasar-plugins/addressbar-color'
    }
  }
]

const plugins = [
  {
    name: 'Addressbar Color',
    path: 'addressbar-color',
    meta: {
      prev: '/vue-directives/touch-swipe',
      next: 'app-fullscreen'
    }
  },
  {
    name: 'App Fullscreen',
    path: 'app-fullscreen',
    meta: {
      prev: 'addressbar-color',
      next: 'app-visibility'
    }
  },
  {
    name: 'App Visibility',
    path: 'app-visibility',
    meta: {
      prev: 'app-fullscreen',
      next: 'bottom-sheet'
    }
  },
  {
    name: 'Bottom Sheet',
    path: 'bottom-sheet',
    meta: {
      prev: 'app-visibility',
      next: 'cookies'
    }
  },
  {
    name: 'Cookies',
    path: 'cookies',
    meta: {
      prev: 'bottom-sheet',
      next: 'dialog'
    }
  },
  {
    name: 'Dialog',
    path: 'dialog',
    meta: {
      prev: 'cookies',
      next: 'loading'
    }
  },
  {
    name: 'Loading',
    path: 'loading',
    meta: {
      prev: 'dialog',
      next: 'loading-bar'
    }
  },
  {
    name: 'Loading Bar',
    path: 'loading-bar',
    meta: {
      prev: 'loading',
      next: 'web-storage'
    }
  },
  {
    name: 'Local/Session Storage',
    path: 'web-storage',
    meta: {
      prev: 'loading-bar',
      next: 'meta'
    }
  },
  {
    name: 'Meta',
    path: 'meta',
    meta: {
      prev: 'web-storage',
      next: 'notify'
    }
  },
  {
    name: 'Notify',
    path: 'notify',
    meta: {
      prev: 'meta',
      next: '/quasar-utils/date-utils'
    }
  }
]

const components = [
  {
    name: 'Ajax Bar',
    path: 'ajax-bar',
    meta: {
      prev: '/layout/floating-action-button',
      next: 'avatar'
    }
  },
  {
    name: 'Avatar',
    path: 'avatar',
    badge: 'new',
    meta: {
      prev: 'ajax-bar',
      next: 'badge'
    }
  },
  {
    name: 'Badge',
    path: 'badge',
    badge: 'new',
    meta: {
      prev: 'avatar',
      next: 'banner'
    }
  },
  {
    name: 'Banner',
    path: 'banner',
    badge: 'new',
    meta: {
      prev: 'badge',
      next: 'bar'
    }
  },
  {
    name: 'Bar',
    path: 'bar',
    badge: 'new',
    meta: {
      prev: 'banner',
      next: 'breadcrumbs'
    }
  },
  {
    name: 'Breadcrumbs',
    path: 'breadcrumbs',
    meta: {
      prev: 'bar',
      next: 'button'
    }
  },
  {
    name: 'Buttons',
    children: [
      {
        name: 'Button',
        path: 'button',
        meta: {
          prev: 'bar',
          next: 'button-group'
        }
      },
      {
        name: 'Button Group',
        path: 'button-group',
        meta: {
          prev: 'button',
          next: 'button-dropdown'
        }
      },
      {
        name: 'Button Dropdown',
        path: 'button-dropdown',
        meta: {
          prev: 'button-group',
          next: 'card'
        }
      }
    ]
  },
  {
    name: 'Card',
    path: 'card',
    meta: {
      prev: 'button-dropdown',
      next: 'carousel'
    }
  },
  {
    name: 'Carousel',
    path: 'carousel',
    meta: {
      prev: 'card',
      next: 'chat'
    }
  },
  {
    name: 'Chat Message',
    path: 'chat',
    meta: {
      prev: 'carousel',
      next: 'chip'
    }
  },
  {
    name: 'Chip',
    path: 'chip',
    meta: {
      prev: 'chat',
      next: 'circular-progress'
    }
  },
  {
    name: 'Circular Progress',
    path: 'circular-progress',
    badge: 'new',
    meta: {
      prev: 'chip',
      next: 'color-picker'
    }
  },
  {
    name: 'Color Picker',
    path: 'color-picker',
    meta: {
      prev: 'circular-progress',
      next: 'dialog'
    }
  },
  {
    name: 'Dialog',
    path: 'dialog',
    meta: {
      prev: 'color-picker',
      next: 'editor'
    }
  },
  {
    name: 'Editor - WYSIWYG',
    path: 'editor',
    meta: {
      prev: 'dialog',
      next: 'expansion-item'
    }
  },
  {
    name: 'Expansion Item',
    path: 'expansion-item',
    meta: {
      prev: 'editor',
      next: 'input'
    }
  },
  {
    name: 'Form Components',
    children: [
      {
        name: 'Input Textfield',
        path: 'input',
        meta: {
          prev: 'expansion-item',
          next: 'select'
        }
      },
      {
        name: 'Select',
        path: 'select',
        meta: {
          prev: 'input',
          next: 'radio'
        }
      },
      {
        name: 'Radio',
        path: 'radio',
        meta: {
          prev: 'select',
          next: 'checkbox'
        }
      },
      {
        name: 'Checkbox',
        path: 'checkbox',
        meta: {
          prev: 'radio',
          next: 'toggle'
        }
      },
      {
        name: 'Toggle',
        path: 'toggle',
        meta: {
          prev: 'checkbox',
          next: 'button-toggle'
        }
      },
      {
        name: 'Button Toggle',
        path: 'button-toggle',
        meta: {
          prev: 'toggle',
          next: 'option-group'
        }
      },
      {
        name: 'Option Group',
        path: 'option-group',
        meta: {
          prev: 'button-toggle',
          next: 'slider'
        }
      },
      {
        name: 'Slider',
        path: 'slider',
        meta: {
          prev: 'option-group',
          next: 'range'
        }
      },
      {
        name: 'Range',
        path: 'range',
        meta: {
          prev: 'slider',
          next: 'time'
        }
      },
      {
        name: 'Time Picker',
        path: 'time',
        meta: {
          prev: 'range',
          next: 'date'
        }
      },
      {
        name: 'Date Picker',
        path: 'date',
        meta: {
          prev: 'time',
          next: 'icon'
        }
      }
    ]
  },
  {
    name: 'Icon',
    path: 'icon',
    meta: {
      prev: 'date',
      next: 'img'
    }
  },
  {
    name: 'Img',
    path: 'img',
    badge: 'new',
    meta: {
      prev: 'icon',
      next: 'infinite-scroll'
    }
  },
  {
    name: 'Infinite Scroll',
    path: 'infinite-scroll',
    meta: {
      prev: 'img',
      next: 'inner-loading'
    }
  },
  {
    name: 'Inner Loading',
    path: 'inner-loading',
    meta: {
      prev: 'infinite-scroll',
      next: 'knob'
    }
  },
  {
    name: 'Knob',
    path: 'knob',
    meta: {
      prev: 'inner-loading',
      next: 'linear-progress'
    }
  },
  {
    name: 'Linear Progress',
    path: 'linear-progress',
    meta: {
      prev: 'knob',
      next: 'list-and-list-items'
    }
  },
  {
    name: 'List & List Items',
    path: 'list-and-list-items',
    meta: {
      prev: 'linear-progress',
      next: 'markup-table'
    }
  },
  {
    name: 'Markup Table',
    path: 'markup-table',
    badge: 'new',
    meta: {
      prev: 'list-and-list-items',
      next: 'menu'
    }
  },
  {
    name: 'Menu',
    path: 'menu',
    meta: {
      prev: 'markup-table',
      next: 'no-ssr'
    }
  },
  {
    name: 'No SSR',
    path: 'no-ssr',
    meta: {
      prev: 'menu',
      next: 'resize-observer'
    }
  },
  {
    name: 'Observers',
    children: [
      {
        name: 'Resize Observer (for Element)',
        path: 'resize-observer',
        meta: {
          prev: 'no-ssr',
          next: 'scroll-observer'
        }
      },
      {
        name: 'Scroll Observer',
        path: 'scroll-observer',
        meta: {
          prev: 'resize-observer',
          next: 'pagination'
        }
      }
    ]
  },
  {
    name: 'Pagination',
    path: 'pagination',
    meta: {
      prev: 'scroll-observer',
      next: 'parallax'
    }
  },
  {
    name: 'Parallax',
    path: 'parallax',
    meta: {
      prev: 'pagination',
      next: 'popup-edit'
    }
  },
  {
    name: 'Popup Edit',
    path: 'popup-edit',
    meta: {
      prev: 'parallax',
      next: 'popup-proxy'
    }
  },
  {
    name: 'Popup Proxy',
    path: 'popup-proxy',
    badge: 'new',
    meta: {
      prev: 'popup-edit',
      next: 'pull-to-refresh'
    }
  },
  {
    name: 'Pull to refresh',
    path: 'pull-to-refresh',
    meta: {
      prev: 'popup-proxy',
      next: 'rating'
    }
  },
  {
    name: 'Rating',
    path: 'rating',
    meta: {
      prev: 'pull-to-refresh',
      next: 'separator'
    }
  },
  {
    name: 'Separator',
    path: 'separator',
    badge: 'new',
    meta: {
      prev: 'rating',
      next: 'slide-item'
    }
  },
  {
    name: 'Slide Item',
    path: 'slide-item',
    badge: 'new',
    meta: {
      prev: 'separator',
      next: 'slide-transition'
    }
  },
  {
    name: 'Slide Transition',
    path: 'slide-transition',
    meta: {
      prev: 'slide-item',
      next: 'space'
    }
  },
  {
    name: 'Space',
    path: 'space',
    badge: 'new',
    meta: {
      prev: 'slide-transition',
      next: 'spinners'
    }
  },
  {
    name: 'Spinners',
    path: 'spinners',
    meta: {
      prev: 'space',
      next: 'splitter'
    }
  },
  {
    name: 'Splitter',
    path: 'splitter',
    badge: 'new',
    meta: {
      prev: 'spinners',
      next: 'stepper'
    }
  },
  {
    name: 'Stepper',
    path: 'stepper',
    meta: {
      prev: 'splitter',
      next: 'table'
    }
  },
  {
    name: 'Table',
    path: 'table',
    meta: {
      prev: 'stepper',
      next: 'tabs'
    }
  },
  {
    name: 'Tabs',
    path: 'tabs',
    meta: {
      prev: 'table',
      next: 'tab-panels'
    }
  },
  {
    name: 'Tab Panels',
    path: 'tab-panels',
    badge: 'new',
    meta: {
      prev: 'tabs',
      next: 'timeline'
    }
  },
  {
    name: 'Timeline',
    path: 'timeline',
    meta: {
      prev: 'tab-panels',
      next: 'toolbar'
    }
  },
  {
    name: 'Toolbar',
    path: 'toolbar',
    meta: {
      prev: 'timeline',
      next: 'tooltip'
    }
  },
  {
    name: 'Tooltip',
    path: 'tooltip',
    meta: {
      prev: 'toolbar',
      next: 'tree'
    }
  },
  {
    name: 'Tree',
    path: 'tree',
    meta: {
      prev: 'tooltip',
      next: 'uploader'
    }
  },
  {
    name: 'Uploader',
    path: 'uploader',
    meta: {
      prev: 'tree',
      next: 'video'
    }
  },
  {
    name: 'Video',
    path: 'video',
    meta: {
      prev: 'uploader',
      next: '/vue-directives/close-dialog'
    }
  }
]

const utils = [
  {
    name: 'Date Utils',
    path: 'date-utils',
    meta: {
      prev: '/quasar-plugins/notify',
      next: 'color-utils'
    }
  },
  {
    name: 'Color Utils',
    path: 'color-utils',
    meta: {
      prev: 'date-utils',
      next: 'dom-utils'
    }
  },
  {
    name: 'DOM Utils',
    path: 'dom-utils',
    meta: {
      prev: 'color-utils',
      next: 'formatter-utils'
    }
  },
  {
    name: 'Formatter Utils',
    path: 'formatter-utils',
    meta: {
      prev: 'dom-utils',
      next: 'other-utils'
    }
  },
  {
    name: 'Other Utils',
    path: 'other-utils',
    meta: {
      prev: 'formatter-utils',
      next: '/quasar-cli/installation'
    }
  }
]

const cli = [
  {
    name: 'Installation',
    path: 'installation',
    meta: {
      prev: '/quasar-utils/other-utils',
      next: 'quasar-conf-js'
    }
  },
  {
    name: '/quasar.conf.js',
    path: 'quasar-conf-js',
    meta: {
      prev: 'installation',
      next: 'testing-and-auditing'
    }
  },
  {
    name: 'Testing & Auditing',
    path: 'testing-and-auditing',
    meta: {
      prev: 'quasar-conf-js',
      next: '/quasar-cli/cli-documentation/directory-structure'
    }
  },
  {
    name: 'CLI Documentation',
    path: 'cli-documentation',
    children: [
      {
        name: 'Directory Structure',
        path: 'directory-structure',
        meta: {
          prev: '/quasar-cli/testing-and-auditing',
          next: 'build-commands'
        }
      },
      {
        name: 'Build Commands',
        path: 'build-commands',
        meta: {
          prev: 'directory-structure',
          next: 'routing'
        }
      },
      {
        name: 'Routing',
        path: 'routing',
        meta: {
          prev: 'build-commands',
          next: 'lazy-loading'
        }
      },
      {
        name: 'Lazy Loading - Code Splitting',
        path: 'lazy-loading',
        meta: {
          prev: 'routing',
          next: 'handling-assets'
        }
      },
      {
        name: 'Handling Assets',
        path: 'handling-assets',
        meta: {
          prev: 'lazy-loading',
          next: 'boot-files'
        }
      },
      {
        name: 'Boot Files',
        path: 'boot-files',
        meta: {
          prev: 'handling-assets',
          next: 'prefetch-feature'
        }
      },
      {
        name: 'Prefetch Feature',
        path: 'prefetch-feature',
        meta: {
          prev: 'boot-files',
          next: 'api-proxying'
        }
      },
      {
        name: 'API Proxying',
        path: 'api-proxying',
        meta: {
          prev: 'prefetch-feature',
          next: 'handling-webpack'
        }
      },
      {
        name: 'Handling Webpack',
        path: 'handling-webpack',
        meta: {
          prev: 'api-proxying',
          next: 'vuex-store'
        }
      },
      {
        name: 'Vuex Store',
        path: 'vuex-store',
        meta: {
          prev: 'handling-webpack',
          next: 'linter'
        }
      },
      {
        name: 'Linter',
        path: 'linter',
        meta: {
          prev: 'vuex-store',
          next: 'supporting-ie'
        }
      },
      {
        name: 'Supporting IE',
        path: 'supporting-ie',
        meta: {
          prev: 'linter',
          next: '/quasar-cli/developing-spa/introduction'
        }
      }
    ]
  },
  {
    name: 'Developing SPA',
    path: 'developing-spa',
    children: [
      {
        name: 'Introduction',
        path: 'introduction',
        meta: {
          prev: '/quasar-cli/cli-documentation/supporting-ie',
          next: 'build-commands'
        }
      },
      {
        name: 'Build Commands',
        path: 'build-commands',
        meta: {
          prev: 'introduction',
          next: 'deploying'
        }
      },
      {
        name: 'Deploying',
        path: 'deploying',
        meta: {
          prev: 'build-commands',
          next: '/quasar-cli/developing-ssr/introduction'
        }
      }
    ]
  },
  {
    name: 'Developing SSR',
    path: 'developing-ssr',
    children: [
      {
        name: 'Introduction',
        path: 'introduction',
        meta: {
          prev: '/quasar-cli/developing-spa/deploying',
          next: 'writing-universal-code'
        }
      },
      {
        name: 'Writing Universal Code',
        path: 'writing-universal-code',
        meta: {
          prev: 'introduction',
          next: 'configuring-ssr'
        }
      },
      {
        name: 'Configuring SSR',
        path: 'configuring-ssr',
        meta: {
          prev: 'writing-universal-code',
          next: 'client-side-hydration'
        }
      },
      {
        name: 'Client Side Hydration',
        path: 'client-side-hydration',
        meta: {
          prev: 'configuring-ssr',
          next: 'handling-404-and-500-errors'
        }
      },
      {
        name: 'Handling 404 and 500 Errors',
        path: 'handling-404-and-500-errors',
        meta: {
          prev: 'client-side-hydration',
          next: 'ssr-with-pwa'
        }
      },
      {
        name: 'SSR with PWA',
        path: 'ssr-with-pwa',
        meta: {
          prev: 'handling-404-and-500-errors',
          next: 'ssr-frequently-asked-questions'
        }
      },
      {
        name: 'SSR Frequently Asked Questions',
        path: 'ssr-frequently-asked-questions',
        meta: {
          prev: 'ssr-with-pwa',
          next: 'build-commands'
        }
      },
      {
        name: 'Build Commands',
        path: 'build-commands',
        meta: {
          prev: 'ssr-frequently-asked-questions',
          next: 'deploying'
        }
      },
      {
        name: 'Deploying',
        path: 'deploying',
        meta: {
          prev: 'build-commands',
          next: '/quasar-cli/developing-pwa/introduction'
        }
      }
    ]
  },
  {
    name: 'Developing PWA',
    path: 'developing-pwa',
    children: [
      {
        name: 'Introduction',
        path: 'introduction',
        meta: {
          prev: '/quasar-cli/developing-ssr/deploying',
          next: 'configuring-pwa'
        }
      },
      {
        name: 'Configuring PWA',
        path: 'configuring-pwa',
        meta: {
          prev: 'introduction',
          next: 'handling-service-worker'
        }
      },
      {
        name: 'Handling Service Worker',
        path: 'handling-service-worker',
        meta: {
          prev: 'configuring-pwa',
          next: 'build-commands'
        }
      },
      {
        name: 'Build Commands',
        path: 'build-commands',
        meta: {
          prev: 'handling-service-worker',
          next: '/quasar-cli/developing-mobile-apps/introduction'
        }
      }
    ]
  },
  {
    name: 'Developing Mobile Apps',
    path: 'developing-mobile-apps',
    children: [
      {
        name: 'Introduction',
        path: 'introduction',
        meta: {
          prev: '/quasar-cli/developing-pwa/build-commands',
          next: 'preparation'
        }
      },
      {
        name: 'Preparation',
        path: 'preparation',
        meta: {
          prev: 'introduction',
          next: 'configuring-cordova'
        }
      },
      {
        name: 'Configuring Cordova',
        path: 'configuring-cordova',
        meta: {
          prev: 'preparation',
          next: 'cordova-plugins'
        }
      },
      {
        name: 'Cordova Plugins',
        path: 'cordova-plugins',
        meta: {
          prev: 'configuring-cordova',
          next: 'build-commands'
        }
      },
      {
        name: 'Build Commands',
        path: 'build-commands',
        meta: {
          prev: 'cordova-plugins',
          next: 'troubleshooting-and-tips'
        }
      },
      {
        name: 'Troubleshooting and Tips',
        path: 'troubleshooting-and-tips',
        meta: {
          prev: 'build-commands',
          next: 'managing-google-analytics'
        }
      },
      {
        name: 'Managing Google Analytics',
        path: 'managing-google-analytics',
        meta: {
          prev: 'troubleshooting-and-tips',
          next: 'publishing-to-store'
        }
      },
      {
        name: 'Publishing to Store',
        path: 'publishing-to-store',
        meta: {
          prev: 'managing-google-analytics',
          next: '/quasar-cli/developing-electron-apps/introduction'
        }
      }
    ]
  },
  {
    name: 'Developing Electron Apps',
    path: 'developing-electron-apps',
    children: [
      {
        name: 'Introduction',
        path: 'introduction',
        meta: {
          prev: '/quasar-cli/developing-mobile-apps/publishing-to-store',
          next: 'preparation'
        }
      },
      {
        name: 'Preparation',
        path: 'preparation',
        meta: {
          prev: 'introduction',
          next: 'configuring-electron'
        }
      },
      {
        name: 'Configuring Electron',
        path: 'configuring-electron',
        meta: {
          prev: 'preparation',
          next: 'electron-packages'
        }
      },
      {
        name: 'Electron Packages',
        path: 'electron-packages',
        meta: {
          prev: 'configuring-electron',
          next: 'build-commands'
        }
      },
      {
        name: 'Build Commands',
        path: 'build-commands',
        meta: {
          prev: 'electron-packages',
          next: 'electron-static-assets'
        }
      },
      {
        name: 'Electron Static Assets',
        path: 'electron-static-assets',
        meta: {
          prev: 'build-commands',
          next: 'electron-security-concerns'
        }
      },
      {
        name: 'Electron Security Concerns',
        path: 'electron-security-concerns',
        meta: {
          prev: 'electron-static-assets',
          next: 'troubleshooting-and-tips'
        }
      },
      {
        name: 'Troubleshooting and Tips',
        path: 'troubleshooting-and-tips',
        meta: {
          prev: 'electron-security-concerns',
          next: '/quasar-cli/ajax-requests'
        }
      }
    ]
  },
  {
    name: 'Ajax Requests',
    path: 'ajax-requests',
    meta: {
      prev: '/quasar-cli/developing-electron-apps/troubleshooting-and-tips',
      next: 'opening-dev-server-to-public'
    }
  },
  {
    name: 'Opening Dev Server To Public',
    path: 'opening-dev-server-to-public',
    meta: {
      prev: 'ajax-requests',
      next: ''
    }
  }
]

export default [
  {
    name: 'Introduction to Quasar',
    icon: 'room',
    path: 'introduction-to-quasar',
    meta: {
      prev: '',
      next: 'sponsors-and-backers'
    }
  },
  {
    name: 'Sponsors, Backers and Supporters',
    icon: 'favorite',
    path: 'sponsors-and-backers',
    meta: {
      prev: 'introduction-to-quasar',
      next: 'getting-started/pick-quasar-flavour'
    }
  },
  {
    name: 'Getting Started',
    icon: 'flight_takeoff',
    path: 'getting-started',
    children: gettingStarted
  },
  {
    name: 'Quasar Options & Helpers',
    icon: 'tune',
    path: 'options',
    children: options
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
    name: 'Quasar Utils',
    icon: 'healing',
    path: 'quasar-utils',
    children: utils
  },
  {
    name: 'Quasar CLI',
    icon: 'build',
    path: 'quasar-cli',
    children: cli
  }
]
