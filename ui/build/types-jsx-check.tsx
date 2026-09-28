// Compiled by build.types.js (never shipped): it type-checks the generated
// index.d.ts the way a userland JSX/TSX file uses it, which the .d.ts-only
// pass cannot do. Every "@ts-expect-error" below is an assertion too: the
// line must keep erroring, or the check fails.
import {
  type CookieRef,
  Cookies,
  LocalStorage,
  type MetaOptions,
  QBtn,
  QInput,
  type QTableColumn,
  SessionStorage,
  type WebStorageRef,
  noop,
  type Resize,
  type TouchPan,
  type TouchRepeat
} from 'quasar'
import {
  type GlobalComponents,
  type ObjectDirective,
  defineComponent,
  ref
} from 'vue'

// what a template ref to <q-btn> resolves to: the instance methods next to
// the exact props and slots (no index signature hiding unknown slot names)
type QBtnTemplateRef = InstanceType<GlobalComponents['QBtn']>
export function checkTemplateRef(btn: QBtnTemplateRef) {
  btn.click()
  btn.$props.dense
  btn.$slots.loading
  // @ts-expect-error unknown methods are rejected
  btn.nonexistent()
  // @ts-expect-error unknown slots are rejected
  btn.$slots.nonexistent
}

// hand-written declarations that reach the index through the barrels
export const meta: MetaOptions = { title: 'x' }
export const noopFn: () => void = noop

// the binding a directive's hooks receive; vue-tsc checks each template
// usage ("v-dir:arg.modifier=\"value\"") against these same generics
type DirectiveBindingOf<D> = Parameters<
  NonNullable<Extract<D, ObjectDirective>['mounted']>
>[1]

export const touchPanModifiers: DirectiveBindingOf<TouchPan>['modifiers'] = {
  horizontal: true,
  prevent: true
}
export const touchPanTypo: DirectiveBindingOf<TouchPan>['modifiers'] = {
  horizontal: true,
  // @ts-expect-error unknown modifiers are rejected
  typo: true
}
// @ts-expect-error a directive without an argument rejects one
export const touchPanArg: DirectiveBindingOf<TouchPan>['arg'] = 'x'

// a placeholder modifier ("[keycode]") accepts any value of its type
export const touchRepeatKeycode: DirectiveBindingOf<TouchRepeat>['modifiers'] =
  { '68': true, esc: true }
export const touchRepeatTypo: DirectiveBindingOf<TouchRepeat>['modifiers'] = {
  // @ts-expect-error a non-numeric key is not a keycode
  f1: true
}

// a static argument arrives as a string, a dynamic one as the bound value
export const resizeStaticArg: DirectiveBindingOf<Resize>['arg'] = '100'
export const resizeDynamicArg: DirectiveBindingOf<Resize>['arg'] = 100
// @ts-expect-error a non-numeric argument is rejected
export const resizeTypoArg: DirectiveBindingOf<Resize>['arg'] = 'fast'

// the storage keys declared once per area type every useStorage() call,
// the cookie names every useCookie() call
declare module 'quasar' {
  interface LocalStorageItems {
    theme: 'light' | 'dark'
  }
  interface SessionStorageItems {
    draft: { title: string }
  }
  interface CookieValues {
    lang: 'en' | 'ro'
  }
}
export const lang: CookieRef<'en' | 'ro'> = Cookies.useCookie('lang', {
  default: () => 'en',
  expires: '30d'
})
// @ts-expect-error a value outside the declared type is rejected
lang.value = 'fr'
// null resets a ref to its default
lang.value = null
// @ts-expect-error a default is a function
Cookies.useCookie('lang', { default: 'en' })
export const visitor = Cookies.useCookie('visitor')
// @ts-expect-error an undeclared cookie is a String or an Object
visitor.value?.title
visitor.value = null
// an undeclared cookie takes a String or an Object; a String default types
// it as a String, not as that literal
export const region: CookieRef<string> = Cookies.useCookie('region', {
  default: () => 'eu'
})
region.value = 'us'
// @ts-expect-error a String default types the cookie as a String
region.value = 5
Cookies.set('settings', { notifications: true })
Cookies.remove('__Secure-session', { secure: true, path: '/' })
export const theme: WebStorageRef<'light' | 'dark' | null> =
  LocalStorage.useStorage('theme')
export const themeWithDefault: WebStorageRef<'light' | 'dark'> =
  LocalStorage.useStorage('theme', { default: () => 'light' })
// @ts-expect-error a value outside the declared type is rejected
theme.value = 'blue'
themeWithDefault.value = null
// @ts-expect-error a default outside the declared type is rejected
LocalStorage.useStorage('theme', { default: () => 'blue' })
// @ts-expect-error a default is a function
LocalStorage.useStorage('theme', { default: 'light' })
// an undeclared key takes any storable value; what its default returns
// sets the type, a primitive widened
export const count: WebStorageRef<number> = LocalStorage.useStorage('count', {
  default: () => 0
})
count.value = 5
count.value = null
export const remember: WebStorageRef<boolean> = SessionStorage.useStorage(
  'remember',
  { default: () => false }
)
remember.value = true
export const settings: WebStorageRef<{ on: boolean }> = LocalStorage.useStorage(
  'settings',
  { default: () => ({ on: true }) }
)
settings.value.on = false
export const sessionDraft: WebStorageRef<{ title: string } | null> =
  SessionStorage.useStorage('draft')
export const draft = LocalStorage.useStorage('draft')
// @ts-expect-error a key declared on the other area is not typed here
draft.value?.title
theme.stop()

export default defineComponent({
  setup() {
    const btn = ref<InstanceType<typeof QBtn>>()
    const text = ref('')
    const columns: QTableColumn[] = []

    return () => (
      <div>
        {/* the props Vue accepts on any component */}
        <QBtn
          ref={btn}
          key="a-key"
          class={['q-ma-md', { 'text-bold': true }]}
          style={{ color: 'red' }}
        />

        {/* own props, events and v-model pairs */}
        <QBtn
          label={columns.length}
          color="primary"
          onClick={() => {
            text.value = 'clicked'
          }}
        />
        <QInput
          modelValue={text.value}
          onUpdate:modelValue={value => {
            text.value = String(value)
          }}
        />

        {/* @ts-expect-error unknown props are still rejected */}
        <QBtn nonExistentProp="x" />

        {/* @ts-expect-error prop types are still enforced */}
        <QBtn dense="not-a-boolean" />
      </div>
    )
  }
})
