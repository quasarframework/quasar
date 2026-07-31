import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import { getRouter } from 'testing/runtime/router.js'
import useRouterLink, {
  useRouterLinkNonMatchingProps,
  useRouterLinkProps
} from './use-router-link.js'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
  vi.restoreAllMocks()
})

// "type" and "tag" are external props of the components using the composable
const hostProps = {
  ...useRouterLinkProps,
  type: String,
  tag: String
}

function mountLink({ props = {}, router, options = {} } = {}) {
  let api

  wrapper = mount(
    defineComponent({
      props: hostProps,
      emits: ['click'],
      setup() {
        api = useRouterLink(options)
        return () => h('div')
      }
    }),
    {
      props,
      global: router ? { plugins: [router] } : void 0
    }
  )

  return api
}

function leftClick() {
  return {
    button: 0,
    preventDefault: vi.fn(),
    get defaultPrevented() {
      return this.preventDefault.mock.calls.length !== 0
    }
  }
}

describe('[useRouterLink API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useRouterLinkNonMatchingProps]', () => {
      test('is defined correctly', () => {
        expect(useRouterLinkNonMatchingProps).$props()
      })

      test('carries no route-matching prop', () => {
        expect(useRouterLinkNonMatchingProps.exact).toBeUndefined()
        expect(useRouterLinkNonMatchingProps.activeClass).toBeUndefined()
        expect(useRouterLinkNonMatchingProps.exactActiveClass).toBeUndefined()
      })
    })

    describe('[(variable)useRouterLinkProps]', () => {
      test('is defined correctly', () => {
        expect(useRouterLinkProps).$props()
      })

      test('extends the non-matching props with the matching ones', () => {
        expect(useRouterLinkProps).toMatchObject(useRouterLinkNonMatchingProps)
        expect(useRouterLinkProps.activeClass.default).toBeTypeOf('string')
        expect(useRouterLinkProps.exactActiveClass.default).toBeTypeOf('string')
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('returns the link API', () => {
        expect(mountLink()).toMatchObject({
          hasRouterLink: expect.$ref(false),
          hasHrefLink: expect.$ref(false),
          hasLink: expect.$ref(false),

          linkTag: expect.$ref(expect.any(String)),
          resolvedLink: expect.$ref(null),
          linkIsActive: expect.$ref(false),
          linkIsExactActive: expect.$ref(false),
          linkClass: expect.$ref(''),
          linkAttrs: expect.$ref({}),

          getLink: expect.any(Function),
          navigateToRouterLink: expect.any(Function),
          navigateOnClick: expect.any(Function)
        })
      })

      test('detects a plain href link', () => {
        const { hasHrefLink, hasRouterLink, hasLink, linkAttrs } = mountLink({
          props: { href: 'https://quasar.dev', target: '_blank' }
        })

        expect(hasHrefLink.value).toBe(true)
        expect(hasRouterLink.value).toBe(false)
        expect(hasLink.value).toBe(true)
        expect(linkAttrs.value).toStrictEqual({
          href: 'https://quasar.dev',
          target: '_blank'
        })
      })

      test('ignores an href link when disabled', () => {
        const { hasHrefLink, hasLink, linkAttrs } = mountLink({
          props: { href: 'https://quasar.dev', disable: true }
        })

        expect(hasHrefLink.value).toBe(false)
        expect(hasLink.value).toBe(false)
        expect(linkAttrs.value).toStrictEqual({})
      })

      test('needs a router to resolve the "to" prop', () => {
        const { hasRouterLink, resolvedLink } = mountLink({
          props: { to: '/target' }
        })

        expect(hasRouterLink.value).toBe(false)
        expect(resolvedLink.value).toBeNull()
      })

      test('resolves the "to" prop into a router link', async () => {
        const router = await getRouter('/target')
        const { hasRouterLink, hasLink, resolvedLink, linkAttrs } = mountLink({
          props: { to: '/target' },
          router
        })

        expect(hasRouterLink.value).toBe(true)
        expect(hasLink.value).toBe(true)
        expect(resolvedLink.value.href).toBe('/target')
        expect(linkAttrs.value).toStrictEqual({
          href: '/target',
          target: void 0
        })
      })

      test.each([[void 0], [null], ['']])(
        'treats an empty "to" prop (%s) as no link',
        async to => {
          const router = await getRouter('/target')
          const { hasRouterLink } = mountLink({ props: { to }, router })

          expect(hasRouterLink.value).toBe(false)
        }
      )

      test('lets an href link win over the "to" prop', async () => {
        const router = await getRouter('/target')
        const { hasHrefLink, hasRouterLink, linkAttrs } = mountLink({
          props: { to: '/target', href: 'https://quasar.dev' },
          router
        })

        expect(hasHrefLink.value).toBe(true)
        expect(hasRouterLink.value).toBe(false)
        expect(linkAttrs.value.href).toBe('https://quasar.dev')
      })

      test('ignores the "to" prop when disabled', async () => {
        const router = await getRouter('/target')
        const { hasRouterLink } = mountLink({
          props: { to: '/target', disable: true },
          router
        })

        expect(hasRouterLink.value).toBe(false)
      })

      test('can be told to keep resolving the link while disabled', async () => {
        const router = await getRouter('/target')
        const { hasRouterLink } = mountLink({
          props: { to: '/target', disable: true },
          router,
          options: { useDisableForRouterLinkProps: false }
        })

        expect(hasRouterLink.value).toBe(true)
      })

      test('renders as an anchor as soon as there is a link', async () => {
        const router = await getRouter('/target')

        expect(mountLink().linkTag.value).toBe('div')
        expect(mountLink({ props: { type: 'a' } }).linkTag.value).toBe('a')
        expect(
          mountLink({ props: { href: 'https://quasar.dev' } }).linkTag.value
        ).toBe('a')
        expect(
          mountLink({ props: { to: '/target' }, router }).linkTag.value
        ).toBe('a')
      })

      test('falls back to the tag prop and then to the supplied fallback', () => {
        expect(mountLink({ props: { tag: 'span' } }).linkTag.value).toBe('span')
        expect(
          mountLink({ options: { fallbackTag: 'label' } }).linkTag.value
        ).toBe('label')
        // the tag prop wins over the fallback
        expect(
          mountLink({
            props: { tag: 'span' },
            options: { fallbackTag: 'label' }
          }).linkTag.value
        ).toBe('span')
      })

      test('marks the link active and exactly active on the current route', async () => {
        const router = await getRouter('/target')
        await router.push('/target')

        const { linkIsActive, linkIsExactActive, linkClass } = mountLink({
          props: { to: '/target' },
          router
        })

        expect(linkIsActive.value).toBe(true)
        expect(linkIsExactActive.value).toBe(true)
        expect(linkClass.value).toContain(
          useRouterLinkProps.activeClass.default
        )
        expect(linkClass.value).toContain(
          useRouterLinkProps.exactActiveClass.default
        )
      })

      test('adds no class for a route which is not active', async () => {
        const router = await getRouter(['/target', '/other'])
        await router.push('/other')

        const { linkIsActive, linkClass } = mountLink({
          props: { to: '/target' },
          router
        })

        expect(linkIsActive.value).toBe(false)
        expect(linkClass.value).toBe('')
      })

      test('marks a parent route as active but not exactly active', async () => {
        const router = await getRouter({ '/parent': 'child' })
        await router.push('/parent/child')

        const { linkIsActive, linkIsExactActive, linkClass } = mountLink({
          props: { to: '/parent' },
          router
        })

        expect(linkIsActive.value).toBe(true)
        expect(linkIsExactActive.value).toBe(false)
        expect(linkClass.value).toContain(
          useRouterLinkProps.activeClass.default
        )
        expect(linkClass.value).not.toContain(
          useRouterLinkProps.exactActiveClass.default
        )
      })

      test('drops the active class of a parent route when exact', async () => {
        const router = await getRouter({ '/parent': 'child' })
        await router.push('/parent/child')

        const { linkClass } = mountLink({
          props: { to: '/parent', exact: true },
          router
        })

        expect(linkClass.value).toBe('')
      })

      test('uses the custom active classes', async () => {
        const router = await getRouter('/target')
        await router.push('/target')

        const { linkClass } = mountLink({
          props: {
            to: '/target',
            activeClass: 'my-active',
            exactActiveClass: 'my-exact'
          },
          router
        })

        expect(linkClass.value).toBe(' my-exact my-active')
      })

      test('resolves an arbitrary route through getLink', async () => {
        const router = await getRouter('/target')
        const { getLink } = mountLink({ router })

        expect(getLink('/target').href).toBe('/target')
      })

      test('returns null from getLink for an unresolvable route', async () => {
        const router = await getRouter('/target')
        const { getLink } = mountLink({ router })

        expect(getLink({ name: 'no-such-route' })).toBeNull()
      })

      test('pushes the route on navigation', async () => {
        const router = await getRouter('/target')
        const pushSpy = vi.spyOn(router, 'push')
        const { navigateToRouterLink } = mountLink({
          props: { to: '/target' },
          router
        })
        const e = leftClick()

        await navigateToRouterLink(e)

        expect(e.preventDefault).toHaveBeenCalledTimes(1)
        expect(pushSpy).toHaveBeenCalledWith('/target')
      })

      test('replaces the route when so configured', async () => {
        const router = await getRouter('/target')
        const replaceSpy = vi.spyOn(router, 'replace')
        const { navigateToRouterLink } = mountLink({
          props: { to: '/target', replace: true },
          router
        })

        await navigateToRouterLink(leftClick())

        expect(replaceSpy).toHaveBeenCalledWith('/target')
      })

      test('navigates to an explicitly supplied route', async () => {
        const router = await getRouter(['/target', '/other'])
        const pushSpy = vi.spyOn(router, 'push')
        const { navigateToRouterLink } = mountLink({
          props: { to: '/target' },
          router
        })

        await navigateToRouterLink(leftClick(), { to: '/other' })

        expect(pushSpy).toHaveBeenCalledWith('/other')
      })

      test('prevents the native navigation but does not route when disabled', async () => {
        const router = await getRouter('/target')
        const pushSpy = vi.spyOn(router, 'push')
        const { navigateToRouterLink } = mountLink({
          props: { to: '/target', disable: true },
          router
        })
        const e = leftClick()

        await expect(navigateToRouterLink(e)).resolves.toBe(false)

        expect(e.preventDefault).toHaveBeenCalledTimes(1)
        expect(pushSpy).not.toHaveBeenCalled()
      })

      test.each([['metaKey'], ['altKey'], ['ctrlKey'], ['shiftKey']])(
        'lets the browser handle a %s click',
        async key => {
          const router = await getRouter('/target')
          const pushSpy = vi.spyOn(router, 'push')
          const { navigateToRouterLink } = mountLink({
            props: { to: '/target' },
            router
          })
          const e = { ...leftClick(), [key]: true }

          await expect(navigateToRouterLink(e)).resolves.toBe(false)

          expect(e.preventDefault).not.toHaveBeenCalled()
          expect(pushSpy).not.toHaveBeenCalled()
        }
      )

      test('lets the browser handle a non-left click', async () => {
        const router = await getRouter('/target')
        const pushSpy = vi.spyOn(router, 'push')
        const { navigateToRouterLink } = mountLink({
          props: { to: '/target' },
          router
        })

        await expect(
          navigateToRouterLink({ ...leftClick(), button: 2 })
        ).resolves.toBe(false)

        expect(pushSpy).not.toHaveBeenCalled()
      })

      test('lets the browser handle a link opening in a new window', async () => {
        const router = await getRouter('/target')
        const pushSpy = vi.spyOn(router, 'push')
        const { navigateToRouterLink } = mountLink({
          props: { to: '/target', target: '_blank' },
          router
        })

        await expect(navigateToRouterLink(leftClick())).resolves.toBe(false)

        expect(pushSpy).not.toHaveBeenCalled()
      })

      test('swallows the router errors unless asked not to', async () => {
        const router = await getRouter('/target')
        const err = new Error('navigation failed')
        vi.spyOn(router, 'push').mockImplementation(() => Promise.reject(err))

        const { navigateToRouterLink } = mountLink({
          props: { to: '/target' },
          router
        })

        await expect(navigateToRouterLink(leftClick())).resolves.toBeUndefined()
        await expect(
          navigateToRouterLink(leftClick(), { returnRouterError: true })
        ).rejects.toBe(err)
      })

      test('emits a click carrying the navigation callback', async () => {
        const router = await getRouter('/target')
        const pushSpy = vi.spyOn(router, 'push')
        const { navigateOnClick } = mountLink({
          props: { to: '/target' },
          router
        })
        const e = leftClick()

        navigateOnClick(e)
        await Promise.resolve()

        const [[emittedEvent, go]] = wrapper.emitted('click')
        expect(emittedEvent).toBe(e)
        expect(go).toBeTypeOf('function')
        expect(pushSpy).toHaveBeenCalledWith('/target')
      })

      test('lets a click handler cancel the navigation', async () => {
        const router = await getRouter('/target')
        const pushSpy = vi.spyOn(router, 'push')
        const { navigateOnClick } = mountLink({
          props: { to: '/target' },
          router
        })
        const e = leftClick()

        // a handler which prevents the default stops the navigation
        e.preventDefault()
        navigateOnClick(e)
        await Promise.resolve()

        expect(pushSpy).not.toHaveBeenCalled()
      })

      test('emits a plain click when there is no router link', () => {
        const { navigateOnClick } = mountLink({
          props: { href: 'https://quasar.dev' }
        })
        const e = leftClick()

        navigateOnClick(e)

        expect(wrapper.emitted('click')).toStrictEqual([[e]])
      })
    })
  })
})
