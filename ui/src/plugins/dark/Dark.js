import { isRuntimeSsrPreHydration } from '../platform/Platform.js'
import { createReactivePlugin } from '../../utils/private.create/create.js'

// the server cannot know the client's color scheme, so it renders 'auto'
// as light and marks the <body> with this attribute; the client hydrates
// in that same (light) state and only resolves 'auto' once it takes over
const ssrAutoAttr = 'data-dark-auto'

const Plugin = /*#__PURE__*/ createReactivePlugin(
  {
    isActive: false,
    mode: false
  },
  {
    __media: void 0,

    set(val) {
      if (__QUASAR_SSR_SERVER__) return

      Plugin.mode = val

      if (val === 'auto') {
        if (Plugin.__media === void 0) {
          Plugin.__media = window.matchMedia('(prefers-color-scheme: dark)')
          Plugin.__updateMedia = () => {
            Plugin.set('auto')
          }
          Plugin.__media.addListener(Plugin.__updateMedia)
        }

        val = Plugin.__media.matches
      } else if (Plugin.__media !== void 0) {
        Plugin.__media.removeListener(Plugin.__updateMedia)
        Plugin.__media = void 0
      }

      Plugin.isActive = val === true
      document.body.classList.remove(`body--${val === true ? 'light' : 'dark'}`)
      document.body.classList.add(`body--${val === true ? 'dark' : 'light'}`)
    },

    toggle() {
      if (!__QUASAR_SSR_SERVER__) Plugin.set(!Plugin.isActive)
    },

    install({ $q, ssrContext, onSSRHydrated }) {
      if (__QUASAR_SSR_SERVER__) {
        const dark = $q.config.dark

        this.isActive = dark === true

        $q.dark = {
          isActive: false,
          mode: false,
          set(val) {
            ssrContext._meta.bodyClasses =
              ssrContext._meta.bodyClasses
                .replace(' body--light', '')
                .replace(' body--dark', '') +
              ` body--${val === true ? 'dark' : 'light'}`

            $q.dark.isActive = val === true
            $q.dark.mode = val
          },
          toggle() {
            $q.dark.set(!$q.dark.isActive)
          }
        }

        $q.dark.set(dark)

        // after the render: App.vue may still switch to an explicit
        // value (e.g. from a cookie), which then needs no client
        // resolution
        ssrContext.onRendered(() => {
          if ($q.dark.mode === 'auto') {
            const meta = ssrContext._meta
            meta.bodyAttrs +=
              (meta.bodyAttrs.length !== 0 ? ' ' : '') + ssrAutoAttr
          }
        })

        return
      }

      $q.dark = this

      if (this.__installed) return

      // a PWA shell boot (no server markup) starts from the config,
      // like an SPA does
      if (isRuntimeSsrPreHydration.value) {
        if (document.body.hasAttribute(ssrAutoAttr)) {
          // hydrate in the server's state (light markup and body class)
          this.mode = 'auto'

          onSSRHydrated.push(() => {
            document.body.removeAttribute(ssrAutoAttr)

            // unless the app already picked an explicit value meanwhile
            if (this.mode === 'auto') {
              this.set('auto')
            }
          })

          return
        }

        // the server-emitted body class is the state the markup was
        // rendered in (the config may have been overridden server-side,
        // e.g. from a cookie)
        this.set(document.body.classList.contains('body--dark'))
        return
      }

      this.set($q.config.dark ?? false)
    }
  }
)

export default Plugin
