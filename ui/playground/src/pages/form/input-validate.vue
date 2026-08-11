<template>
  <div class="q-layout-padding">
    <div style="max-width: 600px" class="q-gutter-y-md">
      <h1>Input Validate</h1>

      <div class="q-gutter-sm">
        <q-radio v-model="type" val="filled" label="Filled" />
        <q-radio v-model="type" val="outlined" label="Outlined" />
        <q-radio v-model="type" val="standout" label="Standout" />
        <q-radio v-model="type" val="standard" label="Standard" />
        <q-radio v-model="type" val="borderless" label="Borderless" />
      </div>

      <div class="text-h6">
        Internal validation
        <q-btn label="Reset" @click="reset" color="primary" flat />

        <q-toggle v-model="testRule20" label="Trigger rule on less than 20" />
      </div>

      <q-input
        v-model.number="test1"
        type="number"
        :label="`Trigger error on less than ${testRule20 ? 20 : 10}`"
        :rules="testRule"
      />

      <q-input
        v-model.number="test2"
        type="number"
        :label="`Lazy trigger error on less than ${testRule20 ? 20 : 10}`"
        :rules="testRule"
        reactive-rules
        lazy-rules
      />

      <q-input
        v-model.number="model"
        type="number"
        :rules="[val => !!val || 'Type a number']"
      />

      <q-input
        ref="input1"
        v-bind="{ [type]: true }"
        v-model="model1"
        label="Label *"
        :rules="[val => !!val || '* Required']"
      />

      <q-input
        ref="input2"
        v-bind="{ [type]: true }"
        v-model="model2"
        label="len <= 3"
        counter
        hint="Type something"
        :rules="[val => val.length <= 3 || 'Please use maximum 3 characters']"
      >
        <template v-slot:append>
          <q-icon name="close" @click="model2 = ''" class="cursor-pointer" />
        </template>
      </q-input>

      <q-input
        ref="input3"
        v-bind="{ [type]: true }"
        v-model="model3"
        label="Required, Lazy, Len < 2"
        counter
        hint="Validation starts after first blur"
        :rules="[
          val => !!val || '* Required',
          val => val.length < 2 || 'Please use maximum 1 character'
        ]"
        lazy-rules
      />

      <q-select
        v-bind="{ [type]: true }"
        v-model="stringSingle"
        :options="stringOptions"
        label="Single - Required, Lazy"
        :rules="[val => !!val || '* Required']"
        lazy-rules
      />

      <q-select
        v-bind="{ [type]: true }"
        v-model="stringSingle"
        :options="stringOptions"
        use-input
        label="Single - use-input - Required, Lazy"
        :rules="[val => !!val || '* Required']"
        lazy-rules
      />

      <q-field
        v-bind="{ [type]: true }"
        label="Slider - >= 10, Lazy"
        stack-label
        :model-value="num"
        :rules="[val => val >= 10 || 'Select at least 10']"
        lazy-rules
      >
        <template v-slot:control>
          <q-slider
            class="q-mt-xl q-mx-md"
            v-model="num"
            :min="0"
            :max="50"
            label-always
          />
        </template>
      </q-field>

      <q-field
        v-bind="{ [type]: true }"
        label="Date - required, Lazy"
        stack-label
        :model-value="date"
        :rules="[val => !!val || '* Required']"
        lazy-rules
      >
        <template v-slot:control>
          <q-date v-model="date" />
        </template>
      </q-field>

      <q-field
        v-bind="{ [type]: true }"
        label="Time - required, Lazy"
        stack-label
        :model-value="time"
        :rules="[val => !!val || '* Required']"
        lazy-rules
      >
        <template v-slot:control>
          <q-time v-model="time" />
        </template>
      </q-field>

      <q-field
        v-bind="{ [type]: true }"
        label="Knob - >= 10, Lazy"
        stack-label
        :model-value="num"
        :rules="[val => val >= 10 || 'Select at least 10']"
        lazy-rules
      >
        <template v-slot:control>
          <q-knob
            class="q-mt-md"
            v-model="num"
            color="black"
            center-color="grey-8"
            size="150px"
            show-value
            :min="0"
            :max="50"
          >
            {{ num }}
          </q-knob>
        </template>
      </q-field>

      <q-input
        ref="input4"
        v-bind="{ [type]: true }"
        v-model="model4"
        label="Required, Len > 1, Len > 2"
        counter
        hint="Multiple"
        :rules="[
          val => !!val || '* Required',
          val => val.length > 1 || 'Please use min 1 characters',
          val => val.length > 2 || 'Please use min 2 characters'
        ]"
      />

      <q-input
        ref="input5"
        v-bind="{ [type]: true }"
        v-model="model5"
        label="Multiple - call stack test *"
        :rules="[callRule1, void 0, callRule2]"
      />

      <q-input
        ref="input6"
        v-bind="{ [type]: true }"
        v-model="model6"
        label="Multiple - async call stack test *"
        :rules="[asyncCallRule1, asyncCallRule2]"
      />

      <div class="text-h6 q-mt-xl">Async rules</div>
      <q-input
        ref="input7"
        v-bind="{ [type]: true }"
        v-model="model7"
        label="Only async *"
        :rules="[asyncRule]"
      />

      <q-input
        ref="input8"
        v-bind="{ [type]: true }"
        v-model="model8"
        label="Multiple async *"
        :rules="[asyncRule, secondAsyncRule]"
      />

      <q-input
        ref="input9"
        v-bind="{ [type]: true }"
        v-model="model9"
        label="Loading slot *"
        :rules="[asyncRule]"
      >
        <template v-slot:loading>
          <q-spinner-gears color="purple" />
        </template>
      </q-input>

      <q-input
        ref="input10"
        v-bind="{ [type]: true }"
        v-model="model10"
        debounce="1000"
        label="X Mixed *"
        :rules="[
          asyncRule,
          val => val.length > 2 || 'Please use min 3 characters'
        ]"
      />

      <q-input
        ref="input11"
        v-bind="{ [type]: true }"
        v-model="model11"
        debounce="1000"
        label="Debounced input *"
        :rules="[asyncRule]"
      />

      <q-input
        ref="input12"
        v-bind="{ [type]: true }"
        v-model="model12"
        label="Mixed, Lazy *"
        lazy-rules
        :rules="[
          asyncRule,
          val => val.length > 2 || 'Please use min 3 characters'
        ]"
      />

      <q-input
        ref="input13"
        v-bind="{ [type]: true }"
        v-model="model13"
        label="Lazy async *"
        lazy-rules
        :rules="[asyncRule]"
      />

      <div class="text-h6 q-mt-xl">External validation</div>
      <div class="q-gutter-sm">
        <q-toggle v-model="error" label="Error state" />
        <q-radio v-model="errorMessage" val="First error" label="First error" />
        <q-radio
          v-model="errorMessage"
          val="Second error"
          label="Second error"
        />
      </div>
      <q-input
        v-bind="{ [type]: true }"
        v-model="modelExternal"
        label="Label"
        hint="Hint"
        :error="error"
        :error-message="errorMessage"
      />

      <q-input
        v-bind="{ [type]: true }"
        v-model="modelExternal"
        label="Label"
        hint="Hint"
        :error="error"
        style="margin-bottom: 30px"
      >
        <template v-slot:error>
          <div>Slotted error message</div>
        </template>
      </q-input>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const n = 13

const model = ref(null)
const type = ref('filled')
const modelExternal = ref('')
const error = ref(false)
const errorMessage = ref('First error')
const stringSingle = ref(null)
const stringOptions = ref(['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'])
const num = ref(0)
const date = ref('')
const time = ref('')

const test1 = ref(11)
const test2 = ref(11)

const testRule20 = ref(false)

const model1 = ref('')
const model2 = ref('')
const model3 = ref('')
const model4 = ref('')
const model5 = ref('')
const model6 = ref('')
const model7 = ref('')
const model8 = ref('')
const model9 = ref('')
const model10 = ref('')
const model11 = ref('')
const model12 = ref('')
const model13 = ref('')

const input1 = ref(null)
const input2 = ref(null)
const input3 = ref(null)
const input4 = ref(null)
const input5 = ref(null)
const input6 = ref(null)
const input7 = ref(null)
const input8 = ref(null)
const input9 = ref(null)
const input10 = ref(null)
const input11 = ref(null)
const input12 = ref(null)
const input13 = ref(null)

const inputRefs = [
  input1,
  input2,
  input3,
  input4,
  input5,
  input6,
  input7,
  input8,
  input9,
  input10,
  input11,
  input12,
  input13
]

const testRule = computed(() =>
  testRule20.value === true
    ? [val => val >= 20 || 'Select at least 20']
    : [val => val >= 10 || 'Select at least 10']
)

function reset() {
  for (let i = 1; i <= n; i++) {
    inputRefs[i - 1].value.resetValidation()
  }
}

function asyncRule(val) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(Boolean(val) || '* Required')
    }, 1000)
  })
}

function secondAsyncRule(val) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve((val && val.length > 2) || 'Min 3 characters')
    }, 1000)
  })
}

function callRule1(val) {
  console.log('call 1')
  return false
}

function callRule2(val) {
  console.log('call 2')
}

function asyncCallRule1(val) {
  console.log('call async 1')
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('some err'))
      // resolve(!!val || '* Required 1')
    }, 1000)
  })
}

function asyncCallRule2(val) {
  console.log('call async 2')
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(Boolean(val) || '* Required 2')
    }, 1000)
  })
}
</script>
