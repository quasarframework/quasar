<template>
  <div class="q-layout-padding" :class="dark ? 'bg-black text-white' : ''">
    <div class="q-gutter-xs">
      <q-radio :dark="dark" v-model="type" val="filled" label="Filled" />
      <q-radio :dark="dark" v-model="type" val="outlined" label="Outlined" />
      <q-radio :dark="dark" v-model="type" val="standout" label="Standout" />
      <q-radio :dark="dark" v-model="type" val="standard" label="Standard" />
      <q-radio
        :dark="dark"
        v-model="type"
        val="borderless"
        label="Borderless"
      />
    </div>
    <div class="q-gutter-xs">
      <q-toggle :dark="dark" v-model="dark" label="Dark" :false-value="null" />
      <q-toggle :dark="dark" v-model="dense" label="Dense" />
      <q-toggle :dark="dark" v-model="disable" label="Disable" />
      <q-toggle :dark="dark" v-model="readonly" label="Readonly" />
      <q-toggle
        :dark="dark"
        v-model="hideBottomSpace"
        label="hide-bottom-space"
      />
      <q-toggle :dark="dark" v-model="prefSuf" label="Prefix + Suffix" />
      <q-toggle :dark="dark" v-model="placeholder" label="Placeholder" />
      <q-toggle :dark="dark" v-model="hideHint" label="Hide Hint" />
      <q-toggle :dark="dark" v-model="square" label="Force square borders" />
      <q-toggle :dark="dark" v-model="autogrow" label="Auto Grow" />
    </div>
    <div class="row q-col-gutter-xs">
      <q-input :dark="dark" dense v-model="textColor" label="Color" clearable />
      <q-input
        :dark="dark"
        dense
        v-model="bgColor"
        label="Bg Color"
        clearable
      />
      <div class="col q-mx-lg q-mt-lg">
        <q-slider
          :dark="dark"
          v-model="fontSize"
          :min="8"
          :max="24"
          label-always
        />
      </div>
    </div>

    <div class="q-my-md">QField with/without label (items-start)</div>
    <div class="row q-col-gutter-xs items-start">
      <q-field
        class="col-6"
        v-bind="props"
        label="Field label"
        stack-label
        bottom-slots
      >
        <template #before>
          <q-icon name="event" />
        </template>

        <template #prepend>
          <q-icon name="event" />
        </template>

        <template #control>
          <div>$$TSP</div>
        </template>

        <template #hint> Hint </template>

        <template #append>
          <q-icon name="search" />
        </template>

        <template #after>
          <q-icon name="search" />
        </template>
      </q-field>

      <q-field class="col-6" v-bind="props" bottom-slots>
        <template #before>
          <q-icon name="event" />
        </template>

        <template #prepend>
          <q-icon name="event" />
        </template>

        <template #control>
          <div>$$TSP</div>
        </template>

        <template #hint> Hint </template>

        <template #append>
          <q-icon name="search" />
        </template>

        <template #after>
          <q-icon name="search" />
        </template>
      </q-field>
    </div>

    <div class="q-my-md"
      >QField with/without label and bottom slot (items-start)</div
    >
    <div class="row q-col-gutter-xs items-start">
      <q-field
        class="col-6"
        v-bind="props"
        label="Field label"
        stack-label
        bottom-slots
      >
        <template #before>
          <q-icon name="event" />
        </template>

        <template #prepend>
          <q-icon name="event" />
        </template>

        <template #control>
          <div>$$TSP</div>
        </template>

        <template #hint> Hint </template>

        <template #append>
          <q-icon name="search" />
        </template>

        <template #after>
          <q-icon name="search" />
        </template>
      </q-field>

      <q-field class="col-6" v-bind="props">
        <template #before>
          <q-icon name="event" />
        </template>

        <template #prepend>
          <q-icon name="event" />
        </template>

        <template #control>
          <div>$$TSP</div>
        </template>

        <template #append>
          <q-icon name="search" />
        </template>

        <template #after>
          <q-icon name="search" />
        </template>
      </q-field>
    </div>

    <div class="q-my-md"
      >QField with/without label and without bottom slot (items-start)</div
    >
    <div class="row q-col-gutter-xs items-start">
      <q-field class="col-6" v-bind="props" label="Field label" stack-label>
        <template #before>
          <q-icon name="event" />
        </template>

        <template #prepend>
          <q-icon name="event" />
        </template>

        <template #control>
          <div>$$TSP</div>
        </template>

        <template #append>
          <q-icon name="search" />
        </template>

        <template #after>
          <q-icon name="search" />
        </template>
      </q-field>

      <q-field class="col-6" v-bind="props">
        <template #before>
          <q-icon name="event" />
        </template>

        <template #prepend>
          <q-icon name="event" />
        </template>

        <template #control>
          <div>$$TSP</div>
        </template>

        <template #append>
          <q-icon name="search" />
        </template>

        <template #after>
          <q-icon name="search" />
        </template>
      </q-field>
    </div>

    <div class="q-my-md">
      QField , QInput, QSelect, QSelect use-input with label and bottom slot
      (items-start)
    </div>
    <div class="row q-col-gutter-xs items-start">
      <q-field
        class="col-3"
        v-bind="props"
        label="Field label"
        stack-label
        bottom-slots
      >
        <template #before>
          <q-icon name="event" />
        </template>

        <template #prepend>
          <q-icon name="event" />
        </template>

        <template #control>
          <div>$$TSP</div>
        </template>

        <template #hint> Hint </template>

        <template #append>
          <q-icon name="search" />
        </template>

        <template #after>
          <q-icon name="search" />
        </template>
      </q-field>

      <q-input
        class="col-3"
        v-bind="props"
        v-model="text"
        label="Field label"
        stack-label
        bottom-slots
      >
        <template #before>
          <q-icon name="event" />
        </template>

        <template #prepend>
          <q-icon name="event" />
        </template>

        <template #hint> Hint </template>

        <template #append>
          <q-icon name="search" />
        </template>

        <template #after>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-select
        class="col-3"
        v-bind="props"
        v-model="text"
        :options="options"
        label="Field label"
        stack-label
        bottom-slots
      >
        <template #before>
          <q-icon name="event" />
        </template>

        <template #prepend>
          <q-icon name="event" />
        </template>

        <template #hint> Hint </template>

        <template #append>
          <q-icon name="search" />
        </template>

        <template #after>
          <q-icon name="search" />
        </template>
      </q-select>

      <q-select
        class="col-3"
        v-bind="props"
        v-model="text"
        :options="options"
        use-input
        label="Field label"
        stack-label
        bottom-slots
      >
        <template #before>
          <q-icon name="event" />
        </template>

        <template #prepend>
          <q-icon name="event" />
        </template>

        <template #hint> Hint </template>

        <template #append>
          <q-icon name="search" />
        </template>

        <template #after>
          <q-icon name="search" />
        </template>
      </q-select>
    </div>

    <div class="q-my-md">
      QField , QInput, QSelect, QSelect use-input with label and bottom slot and
      without marginalia (items-start)
    </div>
    <div class="row q-col-gutter-xs items-start">
      <q-field
        class="col-3"
        v-bind="props"
        label="Field label"
        stack-label
        bottom-slots
      >
        <template #control>
          <div>$$TSP</div>
        </template>

        <template #hint> Hint </template>
      </q-field>

      <q-input
        class="col-3"
        v-bind="props"
        v-model="text"
        label="Field label"
        stack-label
        bottom-slots
      >
        <template #hint> Hint </template>
      </q-input>

      <q-select
        class="col-3"
        v-bind="props"
        v-model="text"
        :options="options"
        label="Field label"
        stack-label
        bottom-slots
        hide-dropdown-icon
      >
        <template #hint> Hint </template>
      </q-select>

      <q-select
        class="col-3"
        v-bind="props"
        v-model="text"
        :options="options"
        use-input
        label="Field label"
        stack-label
        bottom-slots
        hide-dropdown-icon
      >
        <template #hint> Hint </template>
      </q-select>
    </div>

    <div class="q-my-md">
      QField , QInput, QSelect, QSelect use-input with bottom slot and without
      label and marginalia (items-start)
    </div>
    <div class="row q-col-gutter-xs items-start">
      <q-field class="col-3" v-bind="props" bottom-slots>
        <template #control>
          <div>$$TSP</div>
        </template>

        <template #hint> Hint </template>
      </q-field>

      <q-input class="col-3" v-bind="props" v-model="text" bottom-slots>
        <template #hint> Hint </template>
      </q-input>

      <q-select
        class="col-3"
        v-bind="props"
        v-model="text"
        :options="options"
        bottom-slots
        hide-dropdown-icon
      >
        <template #hint> Hint </template>
      </q-select>

      <q-select
        class="col-3"
        v-bind="props"
        v-model="text"
        :options="options"
        use-input
        bottom-slots
        hide-dropdown-icon
      >
        <template #hint> Hint </template>
      </q-select>
    </div>

    <div class="q-my-md">Label size</div>
    <div class="row q-col-gutter-y-sm">
      <q-input
        style="width: 300px"
        v-bind="props"
        v-model="text"
        :label="longLabel"
      />
      <q-separator vertical spaced inset />
      <q-input
        style="width: 300px"
        v-bind="props"
        v-model="text"
        :label="longLabel"
      >
        <template #before>
          <q-icon name="event" />
        </template>

        <template #prepend>
          <q-icon name="event" />
        </template>

        <template #append>
          <q-icon name="search" />
        </template>

        <template #after>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-separator vertical spaced inset />
      <q-select
        style="width: 300px"
        v-bind="props"
        v-model="text"
        :options="options"
        :label="longLabel"
        hide-dropdown-icon
      />
      <q-separator vertical spaced inset />
      <q-select
        style="width: 300px"
        v-bind="props"
        v-model="text"
        :options="options"
        :label="longLabel"
        clearable
        hide-dropdown-icon
      />
      <q-separator vertical spaced inset />
      <q-select
        style="width: 300px"
        v-bind="props"
        v-model="text"
        :options="options"
        :label="longLabel"
        clearable
      />
      <q-separator vertical spaced inset />
      <q-select
        style="width: 300px"
        v-bind="props"
        v-model="text"
        :options="options"
        :label="longLabel"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const type = ref('outlined')
const dark = ref(null)
const dense = ref(false)
const disable = ref(false)
const readonly = ref(false)
const prefSuf = ref(true)
const placeholder = ref(false)
const hideHint = ref(false)
const hideBottomSpace = ref(false)
const square = ref(false)
const autogrow = ref(false)

const prefix = ref('$')
const suffix = ref('TSP')

const textColor = ref(null)
const bgColor = ref(null)

const fontSize = ref(14)

const text = ref('$$TSP')
const options = ref(['$$TSP', '$$$$$'])

const longLabel = ref('A long label - 1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ')

watch(prefSuf, v => {
  if (v) {
    prefix.value = '$'
    suffix.value = 'TSP'
  } else {
    prefix.value = suffix.value = null
  }
})

const props = computed(() => ({
  [type.value]: true,
  type: 'text' + (autogrow.value === true ? 'area' : ''),
  autogrow: autogrow.value,
  hideBottomSpace: hideBottomSpace.value,
  dark: dark.value,
  hideHint: hideHint.value,
  disable: disable.value,
  readonly: readonly.value,
  prefix: prefix.value,
  suffix: suffix.value,
  placeholder: placeholder.value === true ? 'Placeholder text' : null,
  dense: dense.value,
  square: square.value,
  style: { fontSize: `${fontSize.value}px` },
  color:
    typeof textColor.value === 'string' && textColor.value.length !== 0
      ? textColor.value
      : null,
  bgColor:
    typeof bgColor.value === 'string' && bgColor.value.length !== 0
      ? bgColor.value
      : null
}))
</script>
