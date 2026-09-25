// Compiled by build.types.js (never shipped): it type-checks the generated
// index.d.ts the way a userland JSX/TSX file uses it, which the .d.ts-only
// pass cannot do. Every "@ts-expect-error" below is an assertion too: the
// line must keep erroring, or the check fails.
import {
  QBtn,
  QInput,
  type QTableColumn,
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
