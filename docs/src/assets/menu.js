export default [
  {
    name: 'Why donate',
    icon: 'assignment_late',
    path: 'why-donate'
  },
  {
    name: 'API Explorer',
    icon: 'travel_explore',
    path: 'api-explorer'
  },
  {
    name: 'Browser Support',
    icon: 'public',
    path: 'start/browser-support'
  },
  {
    name: 'How to contribute',
    icon: 'code',
    path: 'how-to-contribute',
    children: [
      {
        name: 'Contribution Guide',
        path: 'contribution-guide'
      },
      {
        name: 'Running Projects',
        path: 'running-projects'
      },
      {
        name: 'Start a New Project',
        path: 'new-project'
      },
      {
        name: 'Project Maintainer Role',
        path: 'project-maintainer'
      },
      {
        name: 'Commit Conventions',
        path: 'commit-conventions'
      }
    ]
  },
  {
    name: 'Options & Helpers',
    icon: 'tune',
    path: 'options',
    children: [
      {
        name: 'The $q object',
        path: 'the-q-object'
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
        name: 'Accessibility',
        badge: 'new',
        path: 'accessibility'
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
      }
    ]
  },
  {
    name: 'Style & Identity',
    icon: 'style',
    path: 'style',
    children: [
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
        path: 'theme-builder'
      },
      {
        name: 'Dark Mode',
        path: 'dark-mode'
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
        name: 'Body classes',
        path: 'body-classes'
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
        path: 'sass-scss-variables'
      },
      {
        name: 'Other Helper Classes',
        path: 'other-helper-classes'
      }
    ]
  },
  {
    name: 'Layout and Grid',
    icon: 'view_quilt',
    path: 'layout',
    children: [
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
            name: 'Flexbox patterns',
            path: 'flexbox-patterns'
          },
          {
            name: 'Flex Playground',
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
        external: true,
        path: '/layout-builder'
      },
      {
        name: 'Layout Gallery',
        path: 'gallery'
      },
      {
        name: 'Page Sticky',
        path: 'page-sticky'
      },
      {
        name: 'Page Scroller',
        path: 'page-scroller'
      }
    ]
  },
  {
    name: 'Vue Components',
    icon: 'widgets',
    path: 'vue-components',
    children: [
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
        name: 'Floating Action Button',
        path: 'floating-action-button'
      },
      {
        name: 'Form Components',
        opened: true,
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
            name: 'File picker',
            path: 'file'
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
        name: 'Intersection',
        path: 'intersection'
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
        name: 'Responsive',
        path: 'responsive'
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
        name: 'Skeleton',
        path: 'skeleton'
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
        path: 'virtual-scroll'
      }
    ]
  },
  {
    name: 'Vue Directives',
    icon: 'swap_calls',
    path: 'vue-directives',
    children: [
      {
        name: 'Close Popup',
        path: 'close-popup'
      },
      {
        name: 'Intersection',
        path: 'intersection'
      },
      {
        name: 'Material Ripples',
        path: 'material-ripples'
      },
      {
        name: 'Mutation',
        path: 'mutation'
      },
      {
        name: 'Morph',
        path: 'morph'
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
  },
  {
    name: 'Quasar Plugins',
    icon: 'extension',
    path: 'quasar-plugins',
    children: [
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
        name: 'Dark',
        path: 'dark'
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
  },
  {
    name: 'Vue Composables',
    icon: 'developer_mode',
    path: 'vue-composables',
    children: [
      {
        name: 'useQuasar',
        path: 'use-quasar'
      },
      {
        name: 'useDialogPluginComponent',
        path: 'use-dialog-plugin-component'
      },
      {
        name: 'useFormChild',
        path: 'use-form-child'
      },
      {
        name: 'useMeta',
        path: 'use-meta'
      },
      {
        name: 'useHydration',
        path: 'use-hydration'
      },
      {
        name: 'useId',
        path: 'use-id'
      },
      {
        name: 'useIntersection',
        badge: 'new',
        path: 'use-intersection'
      },
      {
        name: 'useInterval',
        path: 'use-interval'
      },
      {
        name: 'useRenderCache',
        path: 'use-render-cache'
      },
      {
        name: 'useTick',
        path: 'use-tick'
      },
      {
        name: 'useTimeout',
        path: 'use-timeout'
      },
      {
        name: 'useAnimationFrame',
        badge: 'new',
        path: 'use-animation-frame'
      },
      {
        name: 'useSplitAttrs',
        path: 'use-split-attrs'
      }
    ]
  },
  {
    name: 'Security',
    icon: 'security',
    path: 'security',
    children: [
      {
        name: "DO's and DON'Ts",
        path: 'dos-and-donts'
      },
      {
        name: 'Report a vulnerability',
        path: 'report-a-vulnerability'
      }
    ]
  },
  {
    name: 'Quasar CLI (with Vite)',
    icon: 'build',
    path: 'quasar-cli-vite',
    children: [
      {
        name: 'Upgrade Guide',
        path: 'upgrade-guide'
      },
      {
        name: 'Creating a New Project',
        path: 'creating-a-quasar-app-vite-project-folder'
      },
      {
        name: 'The /quasar.config File',
        path: 'quasar-config-file'
      },
      {
        name: 'Convert q/app-webpack Project',
        path: 'convert-app-webpack-to-app-vite'
      },
      {
        name: 'Browser Compatibility',
        path: 'browser-compatibility'
      },
      {
        name: 'TypeScript Support',
        path: 'typescript-support'
      },
      {
        name: 'Directory Structure',
        path: 'directory-structure'
      },
      {
        name: 'Commands List',
        path: 'commands-list'
      },
      {
        name: 'CSS Preprocessors',
        path: 'css-preprocessors'
      },
      {
        name: 'Page Routing with VueRouter',
        path: 'page-routing-with-vue-router'
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
        name: 'Handling Vite',
        path: 'handling-vite'
      },
      {
        name: 'Handling import.meta.env',
        path: 'handling-import-meta-env'
      },
      {
        name: 'State Management with Pinia',
        path: 'state-management-with-pinia'
      },
      {
        name: 'Lint and Format Code',
        path: 'lint-and-format-code'
      },
      {
        name: 'Testing & Auditing',
        path: 'testing-and-auditing'
      },
      {
        name: 'SPA Mode',
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
            name: 'Deploying SPA',
            path: 'deploying'
          }
        ]
      },
      {
        name: 'SSR Mode',
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
            name: 'Preparation',
            path: 'preparation'
          },
          {
            name: 'Installing SSR Deps',
            path: 'installing-ssr-dependencies'
          },
          {
            name: 'Build Commands',
            path: 'build-commands'
          },
          {
            name: 'Configuring SSR',
            path: 'configuring-ssr'
          },
          {
            name: 'The ssrContext',
            path: 'ssr-context'
          },
          {
            name: 'SSR Webserver',
            path: 'ssr-webserver'
          },
          {
            name: 'SSR Middleware',
            path: 'ssr-middleware'
          },
          {
            name: 'Handling 404 and 500 Errors',
            path: 'handling-404-and-500-errors'
          },
          {
            name: 'Hybrid SSR + partial CSR',
            badge: 'new',
            path: 'hybrid-ssr-with-partial-csr'
          },
          {
            name: 'SSR with TypeScript',
            path: 'ssr-with-typescript'
          },
          {
            name: 'Vue SSR Directives',
            path: 'vue-ssr-directives'
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
            name: 'SSR with PWA',
            path: 'ssr-with-pwa'
          },
          {
            name: 'SSR FAQ',
            path: 'ssr-frequently-asked-questions'
          },
          {
            name: 'Deploying SSR',
            path: 'deploying'
          }
        ]
      },
      {
        name: 'SSG Mode',
        path: 'developing-ssg',
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
            name: 'Installing SSG Deps',
            path: 'installing-ssg-dependencies'
          },
          {
            name: 'Build Commands',
            path: 'build-commands'
          },
          {
            name: 'Configuring SSG',
            path: 'configuring-ssg'
          },
          {
            name: 'SSG Code Caveats',
            path: 'ssg-code-caveats'
          },
          {
            name: 'SSG Renderer',
            path: 'ssg-renderer'
          },
          {
            name: 'SSG 404 Error Page',
            path: 'ssg-404-error-page'
          },
          {
            name: 'Hybrid SSG + partial CSR',
            path: 'hybrid-ssg-with-partial-csr'
          },
          {
            name: 'SSG with PWA',
            path: 'ssg-with-pwa'
          },
          {
            name: 'SSG with TypeScript',
            path: 'ssg-with-typescript'
          },
          {
            name: 'App Icons for SSG',
            path: 'app-icons-ssg'
          },
          {
            name: 'SEO for SSG',
            path: 'seo-for-ssg'
          },
          {
            name: 'Deploying SSG',
            path: 'deploying'
          }
        ]
      },
      {
        name: 'PWA Mode',
        path: 'developing-pwa',
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
            name: 'Build Commands',
            path: 'build-commands'
          },
          {
            name: 'Installing PWA Deps',
            path: 'installing-pwa-dependencies'
          },
          {
            name: 'Configuring PWA',
            path: 'configuring-pwa'
          },
          {
            name: 'HMR for PWA',
            path: 'hmr-for-dev'
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
            name: 'PWA with TypeScript',
            path: 'pwa-with-typescript'
          }
        ]
      },
      {
        name: 'Developing Mobile Apps',
        path: 'developing-mobile-apps'
      },
      {
        name: 'Capacitor Mode',
        path: 'developing-capacitor-apps',
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
            name: 'Capacitor versions',
            path: 'capacitor-version-support'
          },
          {
            name: 'Configuring Capacitor',
            path: 'configuring-capacitor'
          },
          {
            name: 'App Icons for Capacitor',
            path: 'app-icons-capacitor'
          },
          {
            name: 'Capacitor API',
            path: 'capacitor-api'
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
          },
          {
            name: 'Live Updates',
            path: 'live-updates'
          }
        ]
      },
      {
        name: 'Cordova Mode',
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
        name: 'Electron Mode',
        path: 'developing-electron-apps',
        children: [
          {
            name: 'Introduction',
            path: 'introduction'
          },
          {
            name: 'Upgrade Guide',
            path: 'electron-upgrade-guide'
          },
          {
            name: 'Preparation',
            path: 'preparation'
          },
          {
            name: 'Installing Electron Deps',
            path: 'installing-electron-dependencies'
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
            name: 'Build Commands',
            path: 'build-commands'
          },
          {
            name: 'Preload Script',
            path: 'electron-preload-script'
          },
          {
            name: 'Accessing files',
            path: 'electron-accessing-files'
          },
          {
            name: 'Frameless Electron Window',
            path: 'frameless-electron-window'
          },
          {
            name: 'Live Updates',
            path: 'electron-live-updates'
          },
          {
            name: 'Electron with TypeScript',
            path: 'electron-with-typescript'
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
        name: 'Browser Extensions (BEX) Mode',
        path: 'developing-browser-extensions',
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
            name: 'Installing BEX Deps',
            path: 'installing-bex-dependencies'
          },
          {
            name: 'Configuring BEX',
            path: 'configuring-bex'
          },
          {
            name: 'App Icons for BEX',
            path: 'app-icons-browser-extension'
          },
          {
            name: 'Build Commands',
            path: 'build-commands'
          },
          {
            name: 'Types of BEX',
            path: 'types-of-bex'
          },
          {
            name: 'BEX Bridge Communication',
            path: 'bex-bridge'
          },
          {
            name: 'Background Script',
            path: 'background-script'
          },
          {
            name: 'Content Scripts',
            path: 'content-scripts'
          },
          {
            name: 'BEX with TypeScript',
            path: 'bex-with-typescript'
          }
        ]
      },
      {
        name: 'Fetching Data',
        path: 'fetching-data'
      },
      {
        name: 'Opening Dev Server To Public',
        path: 'opening-dev-server-to-public'
      }
    ]
  },
  {
    name: 'Quasar CLI (with Webpack)',
    icon: 'build',
    path: 'quasar-cli-webpack',
    children: [
      {
        name: 'About',
        badge: 'Deprecated',
        path: 'about'
      }
    ]
  },
  {
    name: 'Icon Genie CLI',
    icon: 'stars',
    path: 'icongenie',
    children: [
      {
        name: 'Introduction',
        path: 'introduction'
      },

      {
        name: 'Installation / Upgrade notes',
        path: 'installation'
      },

      {
        name: 'Command list',
        path: 'command-list'
      },

      {
        name: 'App Icons List',
        path: 'app-icons-list'
      },

      {
        name: 'Profile files',
        path: 'profile-files'
      }
    ]
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
        name: 'Morph Utils',
        path: 'morph-utils'
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
        name: 'Type Checking Utils',
        path: 'type-checking-utils'
      },
      {
        name: 'EventBus Util',
        path: 'event-bus-util'
      },
      {
        name: 'Other Utils',
        path: 'other-utils'
      }
    ]
  },
  {
    name: 'App Extensions',
    icon: 'note_add',
    path: 'app-extensions',
    children: [
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
        name: 'Common Formulas and Patterns',
        path: 'common-formulas-and-patterns',
        opened: true,
        children: [
          {
            name: 'Starter kit equivalent',
            path: 'starter-kit-equivalent'
          },
          {
            name: 'Provide UI elements',
            path: 'provide-ui-elements'
          },
          {
            name: 'Provide CLI commands',
            path: 'provide-cli-commands'
          },
          {
            name: 'Inject Quasar Plugin',
            path: 'inject-quasar-plugin'
          },
          {
            name: 'JSON API',
            path: 'json-api'
          }
        ]
      }
    ]
  }
]
