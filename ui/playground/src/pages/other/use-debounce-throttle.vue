<template>
  <div class="q-layout-padding q-gutter-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">useDebounce - 500ms</div>
        <div class="row q-gutter-sm items-center">
          <q-input
            v-model="query"
            dense
            outlined
            placeholder="type here"
            @update:model-value="onQuery"
          />
          <q-toggle v-model="immediate" label="immediate" />
          <q-btn flat label="debounceFn.flush()" @click="onFlushDebounce" />
          <q-btn flat label="debounceFn.cancel()" @click="onCancelDebounce" />
          <q-badge
            :color="isDebouncePending ? 'positive' : 'grey'"
            :label="isDebouncePending ? 'pending' : 'idle'"
          />
          <q-badge color="secondary" :label="`runs: ${searchRuns}`" />
          <q-badge color="secondary" :label="`last: ${lastQuery}`" />
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">useThrottle - 500ms</div>
        <div class="row q-gutter-sm items-center">
          <q-btn color="primary" label="call()" @click="onClick" />
          <q-toggle v-model="trailing" label="trailing" />
          <q-btn flat label="throttleFn.flush()" @click="onFlushThrottle" />
          <q-btn flat label="throttleFn.cancel()" @click="onCancelThrottle" />
          <q-badge color="secondary" :label="`calls: ${calls}`" />
          <q-badge color="secondary" :label="`runs: ${throttleRuns}`" />
          <q-badge color="secondary" :label="`last: ${lastCall}`" />
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">
          keep-alive - deactivation drops the waiting call
        </div>
        <q-toggle v-model="showChild" label="show child" />
        <keep-alive>
          <debounce-child v-if="showChild" />
        </keep-alive>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { computed, defineComponent, h, ref } from 'vue'
import { useDebounce, useThrottle } from 'quasar'

const query = ref('')
const lastQuery = ref('-')
const searchRuns = ref(0)
const immediate = ref(false)

function onSearch(value) {
  searchRuns.value++
  lastQuery.value = value
}

const trailingDebounce = useDebounce(onSearch, 500)
const immediateDebounce = useDebounce(onSearch, 500, true)
const debounceFn = computed(() =>
  immediate.value === true ? immediateDebounce : trailingDebounce
)
const isDebouncePending = computed(() => debounceFn.value.isPending)

function onQuery(value) {
  debounceFn.value(value)
}
function onFlushDebounce() {
  debounceFn.value.flush()
}
function onCancelDebounce() {
  debounceFn.value.cancel()
}

const calls = ref(0)
const throttleRuns = ref(0)
const lastCall = ref('-')
const trailing = ref(false)

function onRun(n) {
  throttleRuns.value++
  lastCall.value = n
}

const droppingThrottle = useThrottle(onRun, 500)
const trailingThrottle = useThrottle(onRun, 500, true)
const throttleFn = computed(() =>
  trailing.value === true ? trailingThrottle : droppingThrottle
)

function onClick() {
  calls.value++
  throttleFn.value(calls.value)
}
function onFlushThrottle() {
  throttleFn.value.flush()
}
function onCancelThrottle() {
  throttleFn.value.cancel()
}

const showChild = ref(true)

const DebounceChild = defineComponent({
  name: 'DebounceChild',
  setup() {
    const runs = ref(0)
    const childFn = useDebounce(() => {
      runs.value++
    }, 3000)

    return () =>
      h('div', { class: 'row q-gutter-sm items-center q-mt-sm' }, [
        h('button', { onClick: childFn }, 'call (3s), then hide me'),
        h('span', `pending: ${childFn.isPending}, runs: ${runs.value}`)
      ])
  }
})
</script>
