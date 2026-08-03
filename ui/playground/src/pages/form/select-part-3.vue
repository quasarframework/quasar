<template>
  <div class="q-layout-padding">
    <div class="q-gutter-md">
      <div>Model: {{ model }}</div>

      <q-btn
        label="Focus 1"
        @click="
          e => {
            $refs.sel1.focus(e)
          }
        "
      />
      <q-btn label="Show 1" @click="$refs.sel1.showPopup()" />

      <q-btn
        label="Focus 2"
        @click="
          e => {
            $refs.sel2.focus(e)
          }
        "
      />
      <q-btn label="Show 2" @click="$refs.sel2.showPopup()" />
      <q-checkbox
        v-model="forceMenu"
        toggle-indeterminate
        :label="forceMenuLabel"
      />

      <q-btn
        label="Focus 3"
        @click="
          e => {
            $refs.sel3.focus(e)
          }
        "
      />
      <q-btn label="Show 3" @click="$refs.sel3.showPopup()" />

      <q-select
        filled
        ref="sel1"
        v-model="model"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        label="Hide selected"
        :options="options"
        @filter="filterFn"
        style="max-width: 450px"
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
        ref="sel2"
        v-model="model"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        label="Hide selected, no filter"
        :options="options"
        style="max-width: 450px"
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
        ref="sel3"
        v-model="model"
        label="Simple"
        :options="options"
        style="max-width: 450px"
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
        v-model="model2"
        use-input
        hide-selected
        fill-input
        emit-value
        map-options
        label="Lazy filter with new options"
        :options="objectOptions"
        @filter="filterObjectFn"
        style="max-width: 450px"
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
        v-model="model3"
        use-input
        hide-selected
        fill-input
        emit-value
        map-options
        label="Lots of options"
        :options="lotsOptions"
        @filter="filterLotsFn"
        style="max-width: 450px"
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
        v-model="model3"
        use-input
        hide-selected
        fill-input
        emit-value
        map-options
        label="Lots of options - before-options and after-options slots"
        :options="lotsOptions"
        @filter="filterLotsFn"
        style="max-width: 450px"
        clearable
        :behavior="behavior"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>

        <template v-slot:before-options>
          <q-item class="bg-black text-white q-py-lg">
            <q-item-section>
              Rendered before the list of options
            </q-item-section>
          </q-item>
        </template>

        <template v-slot:after-options>
          <q-item class="bg-black text-white q-py-lg">
            <q-item-section>
              Rendered after the list of options
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select
        filled
        v-model="model3"
        use-input
        hide-selected
        fill-input
        emit-value
        map-options
        label="Lots of options - sticky before-options"
        :options="lotsOptions"
        @filter="filterLotsFn"
        style="max-width: 450px"
        clearable
        :behavior="behavior"
        :virtual-scroll-sticky-size-start="69"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>

        <template v-slot:before-options>
          <q-item class="bg-black text-white q-py-lg sticky-top">
            <q-item-section>
              Rendered before the list of options
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select
        filled
        v-model="model3"
        use-input
        hide-selected
        fill-input
        emit-value
        map-options
        label="Lots of options - horizontal"
        :options="lotsOptions"
        @filter="filterLotsFn"
        style="max-width: 450px"
        clearable
        :behavior="behavior"
        virtual-scroll-horizontal
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select
        filled
        v-model="model3"
        use-input
        hide-selected
        fill-input
        emit-value
        map-options
        label="Lots of options - horizontal - before-options and after-options slots"
        :options="lotsOptions"
        @filter="filterLotsFn"
        style="max-width: 450px"
        clearable
        :behavior="behavior"
        virtual-scroll-horizontal
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>

        <template v-slot:before-options>
          <q-item class="bg-black text-white q-py-lg">
            <q-item-section>
              Rendered before the list of options
            </q-item-section>
          </q-item>
        </template>

        <template v-slot:after-options>
          <q-item class="bg-black text-white q-py-lg">
            <q-item-section>
              Rendered after the list of options
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>
</template>

<style lang="sass">
.sticky-top
  position: sticky
  opacity: 1
  z-index: 1
  top: 0
</style>

<script setup>
import { computed, ref } from 'vue'

const stringOptions = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'],
  createObjectOptions = () => [
    {
      label: 'Google',
      value: 1
    },
    {
      label: 'Facebook',
      value: 2
    },
    {
      label: 'Twitter',
      value: 3
    },
    {
      label: 'Apple',
      value: 4
    },
    {
      label: 'Oracle',
      value: 5
    }
  ],
  createLotsOptions = () =>
    Array.from({ length: 5000 }, (item, i) => ({
      value: i,
      label: `Item ${i}`
    }))

const model = ref('Twitter')
const model2 = ref(null)
const model3 = ref(null)
const options = ref(stringOptions)
const objectOptions = ref(createObjectOptions())
const lotsOptions = ref(Object.freeze(createLotsOptions()))
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
      options.value = stringOptions
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    options.value = stringOptions.filter(v => v.toLowerCase().includes(needle))
  })
}

function filterObjectFn(val, update) {
  console.log('filterObjectFn', val)
  if (val === '') {
    update(() => {
      objectOptions.value = createObjectOptions()
    })
    return
  }

  setTimeout(() => {
    update(() => {
      const needle = val.toLowerCase()
      objectOptions.value = createObjectOptions().filter(v =>
        v.label.toLowerCase().includes(needle)
      )
    })
  }, 100)
}

function filterLotsFn(val, update) {
  console.log('filterLotsFn', val)
  if (val === '') {
    update(() => {
      lotsOptions.value = Object.freeze(createLotsOptions())
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    lotsOptions.value = Object.freeze(
      createLotsOptions().filter(v => v.label.toLowerCase().includes(needle))
    )
  })
}
</script>
