<template>
  <div class="q-layout-padding">
    <div class="bg-black text-white q-pa-sm q-mb-xl">
      <q-checkbox
        v-model="forceMenu"
        toggle-indeterminate
        dark
        :label="forceMenuLabel"
      />
      / ModelS: {{ modelS || 'null' }} / ModelM: {{ modelM || 'null' }}
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-xs-12 col-md-4 q-gutter-y-md">
        <!-- Single -->
        <q-select
          filled
          color="amber"
          v-model="modelS"
          label="Single"
          :options="options"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          filled
          color="green"
          v-model="modelS"
          label="Single - useInput"
          :options="options"
          use-input
          input-debounce="0"
          @filter="filterFn"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          filled
          color="purple"
          v-model="modelS"
          label="Single - useInput - hideSelected"
          :options="options"
          use-input
          input-debounce="0"
          hide-selected
          @filter="filterFn"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          filled
          color="deep-orange"
          v-model="modelS"
          label="Single - useInput - fillInput"
          :options="options"
          use-input
          input-debounce="0"
          fill-input
          @filter="filterFn"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          filled
          v-model="modelS"
          label="Single - useInput - hideSelected - fillInput"
          :options="options"
          use-input
          input-debounce="0"
          hide-selected
          fill-input
          @filter="filterFn"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>

      <div class="col-xs-12 col-md-4 q-gutter-y-md">
        <!-- Multiple -->
        <q-select
          filled
          v-model="modelM"
          multiple
          label="Multiple"
          :options="options"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          filled
          v-model="modelM"
          multiple
          label="Multiple - useInput"
          :options="options"
          use-input
          input-debounce="0"
          @filter="filterFn"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          filled
          v-model="modelM"
          multiple
          label="Multiple - useInput - hideSelected"
          :options="options"
          use-input
          input-debounce="0"
          hide-selected
          @filter="filterFn"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          filled
          v-model="modelM"
          multiple
          label="Multiple - useInput - fillInput"
          :options="options"
          use-input
          input-debounce="0"
          fill-input
          @filter="filterFn"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          filled
          v-model="modelM"
          multiple
          label="Multiple - useInput - hideSelected - fillInput"
          :options="options"
          use-input
          input-debounce="0"
          hide-selected
          fill-input
          @filter="filterFn"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>

      <div class="col-xs-12 col-md-4 q-gutter-y-md">
        <!-- Multiple Chips -->
        <q-select
          filled
          v-model="modelM"
          multiple
          use-chips
          label="Multiple Chips"
          :options="options"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          filled
          v-model="modelM"
          multiple
          use-chips
          label="Multiple Chips - useInput"
          :options="options"
          use-input
          input-debounce="0"
          @filter="filterFn"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          filled
          v-model="modelM"
          multiple
          use-chips
          label="Multiple Chips - useInput - hideSelected"
          :options="options"
          use-input
          input-debounce="0"
          hide-selected
          @filter="filterFn"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          filled
          v-model="modelM"
          multiple
          use-chips
          label="Multiple Chips - useInput - fillInput"
          :options="options"
          use-input
          input-debounce="0"
          fill-input
          @filter="filterFn"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          filled
          v-model="modelM"
          multiple
          use-chips
          label="Multiple Chips - useInput - hideSelected - fillInput"
          :options="options"
          use-input
          input-debounce="0"
          hide-selected
          fill-input
          @filter="filterFn"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          filled
          v-model="modelO"
          map-options
          emit-value
          multiple
          use-chips
          label="Obj (map-options, emit-value) - Multiple Chips - useInput"
          :options="objOptions"
          use-input
          input-debounce="0"
          @filter="filterFnObj"
          clearable
          :behavior="behavior"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>

    <div class="column q-gutter-y-md q-mt-lg">
      <q-select
        filled
        v-model="modelK"
        label="Single - strings - kbd search - option label/value str"
        :options="optionsK"
        option-value="value"
        option-label="label"
        clearable
        :behavior="behavior"
      />

      <q-select
        filled
        v-model="modelK"
        label="Single - strings - kbd search - option label/value str - map"
        :options="optionsK"
        option-value="value"
        option-label="label"
        emit-value
        map-options
        clearable
        :behavior="behavior"
      />

      <q-select
        filled
        v-model="modelK"
        label="Single - objs - kbd search - option label/value str - map"
        :options="objOptionsK"
        option-value="value"
        option-label="label"
        emit-value
        map-options
        clearable
        :behavior="behavior"
      />

      <q-select
        filled
        v-model="modelKO"
        label="Single - objs - kbd search - option label/value str"
        :options="objOptionsK"
        option-value="value"
        option-label="label"
        clearable
        :behavior="behavior"
      />

      <q-select
        filled
        v-model="modelK"
        label="Single - strings - kbd search - option label/value fn"
        :options="optionsK"
        :option-value="kOptionValue"
        :option-label="kOptionLabel"
        clearable
        :behavior="behavior"
      />

      <q-select
        filled
        v-model="modelK"
        label="Single - strings - kbd search - option label/value fn - map"
        :options="optionsK"
        :option-value="kOptionValue"
        :option-label="kOptionLabel"
        emit-value
        map-options
        clearable
        :behavior="behavior"
      />

      <q-select
        filled
        v-model="modelK"
        label="Single - objs - kbd search - option label/value fn - map"
        :options="objOptionsK"
        :option-value="kOptionValue"
        :option-label="kOptionLabel"
        emit-value
        map-options
        clearable
        :behavior="behavior"
      />

      <q-select
        filled
        v-model="modelKO"
        label="Single - objs - kbd search - option label/value fn"
        :options="objOptionsK"
        :option-value="kOptionValue"
        :option-label="kOptionLabel"
        clearable
        :behavior="behavior"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const allOptions = [
    'Google 1',
    'Facebook 1',
    'Twitter 1',
    'Apple 1',
    'Oracle 1',
    'Google 2',
    'Facebook 2',
    'Twitter 2',
    'Apple 2',
    'Oracle 2',
    'Google 3',
    'Facebook 3',
    'Twitter 3',
    'Apple 3',
    'Oracle 3',
    'A very long text of an options that goes over the length limit when you open the debugger'
  ],
  allObjOptions = allOptions.map((label, value) => ({ label, value })),
  optionsK = [
    'A A label',
    'A B label',
    'A C label',
    'B A label',
    'B B label',
    'B C label',
    'C A label',
    'C B label',
    'C C label'
  ],
  objOptionsK = optionsK.map((label, value) => ({ label, value }))

const modelS = ref(null)
const modelM = ref(null)
const modelO = ref([3, 4, 5])
const modelK = ref(null)
const modelKO = ref(null)
const options = ref(allOptions)
const objOptions = ref(allObjOptions)
const forceMenu = ref(null)

const behavior = computed(() =>
  forceMenu.value === null
    ? 'default'
    : forceMenu.value === true
      ? 'menu'
      : 'dialog'
)

const forceMenuLabel = computed(() => {
  if (forceMenu.value === true) {
    return 'Force menu'
  }

  return forceMenu.value === false ? 'Force dialog' : 'Based on platform'
})

function filterFn(val, update) {
  console.log('filterFn', val)

  if (val === '') {
    update(() => {
      options.value = allOptions
    })
    return
  }

  update(
    () => {
      const needle = val.toLowerCase()
      options.value = allOptions.filter(v => v.toLowerCase().includes(needle))
    },
    vmRef => {
      vmRef.setOptionIndex(-1)
      vmRef.moveOptionSelection(1, true)
    }
  )
}

function filterFnObj(val, update) {
  console.log('filterFnObj', val)
  if (val === '') {
    update(() => {
      objOptions.value = allObjOptions
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    objOptions.value = allObjOptions.filter(v =>
      v.label.toLowerCase().includes(needle)
    )
  })
}

function kOptionValue(item) {
  if (item === void 0) console.trace('kOptionValue', item)

  return item === Object(item) ? item.value : item
}

function kOptionLabel(item) {
  if (item === void 0) console.trace('kOptionLabel', item)

  return item === Object(item) ? item.label : item
}
</script>
