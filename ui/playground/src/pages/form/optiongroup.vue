<template>
  <div>
    <div class="q-layout-padding" :class="dark ? 'bg-black text-white' : ''">
      <q-toggle
        v-model="dark"
        :dark="dark"
        :dense="dense"
        label="Dark"
        :false-value="null"
      />
      <q-toggle
        v-model="keepColor"
        :dark="dark"
        :dense="dense"
        label="Keep Color"
      />
      <q-toggle v-model="dense" :dark="dark" :dense="dense" label="Dense" />

      <p class="text-h6 text-weight-bold">Radio</p>
      <div class="label bg-secondary text-white">
        Model
        <span class="right-detail"
          ><em>{{ radio }}</em></span
        >
      </div>
      <q-option-group
        inline
        type="radio"
        color="secondary"
        v-model="radio"
        @update:model-value="onInput"
        :dark="dark"
        :dense="dense"
        :keep-color="keepColor"
        :options="[
          {
            label:
              'Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 ',
            value: 'op2'
          },
          { label: 'Option 3', value: 'op3' },
          { label: 'Option 4', value: 'op4' }
        ]"
      />

      <q-option-group
        type="radio"
        v-model="radio"
        @focus="onFocus"
        @blur="onBlur"
        :dark="dark"
        :dense="dense"
        :keep-color="keepColor"
        :options="[
          {
            label:
              'Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 ',
            value: 'op2',
            dark,
            keepColor
          },
          { label: 'Option 3', value: 'op3', dark, keepColor },
          { label: 'Option 4', value: 'op4', dark, keepColor }
        ]"
      />

      <p class="text-h6 text-weight-bold">Checkbox</p>
      <div class="label bg-secondary text-white">
        Model
        <span class="right-detail"
          ><em>{{ checkbox }}</em></span
        >
      </div>
      <q-option-group
        inline
        type="checkbox"
        color="secondary"
        v-model="checkbox"
        @update:model-value="onInput"
        :dark="dark"
        :dense="dense"
        :keep-color="keepColor"
        :options="[
          {
            label:
              'Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 ',
            value: 'op2'
          },
          { label: 'Option 3', value: 'op3' },
          { label: 'Option 4', value: 'op4' }
        ]"
      />

      <q-option-group
        type="checkbox"
        v-model="checkbox"
        @focus="onFocus"
        @blur="onBlur"
        :dark="dark"
        :dense="dense"
        :keep-color="keepColor"
        :options="[
          {
            label:
              'Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 ',
            value: 'op2',
            dark,
            keepColor
          },
          { label: 'Option 3', value: 'op3', dark, keepColor },
          { label: 'Option 4', value: 'op4', dark, keepColor }
        ]"
      />

      <p class="text-h6 text-weight-bold">Toggle</p>
      <div class="label bg-secondary text-white">
        Model
        <span class="right-detail"
          ><em>{{ toggle }}</em></span
        >
      </div>
      <q-option-group
        inline
        type="toggle"
        color="secondary"
        v-model="toggle"
        @update:model-value="onInput"
        :dark="dark"
        :dense="dense"
        :keep-color="keepColor"
        :options="[
          {
            label:
              'Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 ',
            value: 'op2'
          },
          { label: 'Option 3', value: 'op3' },
          { label: 'Option 4', value: 'op4' }
        ]"
      />

      <q-option-group
        type="toggle"
        v-model="toggle"
        @focus="onFocus"
        @blur="onBlur"
        :dark="dark"
        :dense="dense"
        :keep-color="keepColor"
        :options="[
          {
            label:
              'Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 ',
            value: 'op2',
            dark,
            keepColor
          },
          { label: 'Option 3', value: 'op3', dark, keepColor },
          { label: 'Option 4', value: 'op4', dark, keepColor }
        ]"
      />
    </div>

    <p class="text-h6 text-weight-bold">Slots</p>
    <q-option-group
      type="toggle"
      color="secondary"
      v-model="toggle"
      :dark="dark"
      :dense="dense"
      :keep-color="keepColor"
      :options="[
        {
          label:
            'Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 ',
          value: 'op2'
        },
        { label: 'Option 3', value: 'op3' },
        { label: 'Option 4', value: 'op4' }
      ]"
    >
      <template v-slot:label="opt">
        Label: <q-icon name="star" /> {{ opt.label }}
      </template>

      <template v-slot:label-2="opt">
        v-slot:label-3 <q-icon name="star" color="negative" /> {{ opt.label }}
        <q-tooltip>Tooltip</q-tooltip>
      </template>
    </q-option-group>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const radio = ref('op2')
const checkbox = ref(['op2'])
const toggle = ref(['op2'])
const dark = ref(null)
const dense = ref(false)
const keepColor = ref(false)

// Note: the original Options API code had a watcher on a non-existent
// "group" property, which could never fire; it has been dropped.

function onChange(val) {
  console.log('@change', JSON.stringify(val))
}
function onInput(val) {
  console.log('@update:model-value', JSON.stringify(val))
}
function onFocus() {
  console.log('focused')
}
function onBlur() {
  console.log('blur')
}
</script>
