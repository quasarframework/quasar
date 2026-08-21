// Compiled by build.types.js (never shipped): it type-checks the generated
// index.d.ts the way a userland JSX/TSX file uses it, which the .d.ts-only
// pass cannot do. Every "@ts-expect-error" below is an assertion too: the
// line must keep erroring, or the check fails.
import { QBtn, QInput, type QTableColumn } from 'quasar'
import { defineComponent, ref } from 'vue'

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
