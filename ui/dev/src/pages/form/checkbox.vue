<template>
  <div>
    <div class="q-layout-padding" :class="dark ? 'bg-black text-white' : ''">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{ checked }}</em></span>
      </div>
      <q-toggle v-model="dark" :dark="dark" :dense="dense" label="Dark" :false-value="null" />
      <q-toggle v-model="keepColor" :dark="dark" :dense="dense" label="Keep Color" />
      <q-toggle v-model="dense" :dark="dark" :dense="dense" label="Dense" />

      <p class="caption">
        Standalone
      </p>
      <q-checkbox v-model="checked" :dark="dark" :dense="dense" :keep-color="keepColor" />
      <q-checkbox v-model="checked" style="margin-left: 50px" :dark="dark" :dense="dense" :keep-color="keepColor" />

      <p class="caption">
        Sizes
      </p>
      <q-checkbox
        v-for="size in ['xs', 'sm', 'md', 'lg', 'xl', '150px']"
        :key="size"
        :size="size"
        :label="size"
        v-model="indModel" toggle-indeterminate :dark="dark" :dense="dense" :keep-color="keepColor"
      />

      <p class="caption">
        Indeterminate
      </p>
      <q-checkbox v-model="indModel" toggle-indeterminate :dark="dark" :dense="dense" :keep-color="keepColor" label="Three states" />
      <q-checkbox v-model="indModel" toggle-indeterminate :dark="dark" :dense="dense" keep-color label="Three states" />
      <q-checkbox v-model="indModel" toggle-indeterminate :dark="dark" :dense="dense" :keep-color="keepColor" color="orange" label="Three states" />
      <q-checkbox v-model="indModel" toggle-indeterminate :dark="dark" :dense="dense" keep-color color="orange" label="Three states" size="100px" />

      <p class="caption">
        Order ({{ JSON.stringify(orderModel) }})
      </p>
      <div class="q-gutter-sm row items-center q-mb-sm">
        <q-btn size="sm" label="Set true" @click="orderModel = true" />
        <q-btn size="sm" label="Set false" @click="orderModel = false" />
        <q-btn size="sm" label="Set indeterminate" @click="orderModel = null" />
      </div>

      <div class="inline-block q-pa-sm" style="border: 1px solid">
        <q-checkbox v-model="orderModel" toggle-order="tf" label="tf" :dark="dark" />
        <q-checkbox v-model="orderModel" toggle-order="ft" label="ft" :dark="dark" />
      </div>
      <div class="inline-block q-pa-sm" style="border: 1px solid">
        <q-checkbox v-model="orderModel" toggle-order="tf" label="tf + toggle indet" toggle-indeterminate :dark="dark" />
        <q-checkbox v-model="orderModel" toggle-order="ft" label="ft + toggle indet" toggle-indeterminate :dark="dark" />
      </div>
      <p class="caption">
        Tests
      </p>
      <q-checkbox @change="onChange" @update:model-value="onInput" v-model="checked" :dark="dark" :dense="dense" :keep-color="keepColor" />
      <q-checkbox v-model="checked" label="Label" :dark="dark" :dense="dense" :keep-color="keepColor" />

      <q-checkbox v-model="checked" label="Checkbox Label" :dark="dark" :dense="dense" :keep-color="keepColor" />
      <q-checkbox v-model="checked" color="orange" label="Checkbox Label" :dark="dark" :dense="dense" :keep-color="keepColor" />

      <p class="caption">
        Label on the left side
      </p>
      <q-checkbox v-model="checked" color="teal" left-label label="Checkbox Label" :dark="dark" :dense="dense" :keep-color="keepColor" />
      <q-checkbox v-model="checked" color="orange" left-label label="Checkbox Label" :dark="dark" :dense="dense" :keep-color="keepColor" />
      <q-checkbox v-model="checked" color="dark" left-label label="Checkbox Label" :dark="dark" :dense="dense" :keep-color="keepColor" />

      <p class="caption">
        Array Model
      </p>
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{ selection }}</em></span>
      </div>

      <q-checkbox @change="onChange" v-model="selection" val="one" label="One" :dark="dark" :dense="dense" :keep-color="keepColor" />
      <q-checkbox @change="onChange" v-model="selection" val="two" label="Two" :dark="dark" :dense="dense" :keep-color="keepColor" />
      <q-checkbox @change="onChange" v-model="selection" val="three" label="Three" :dark="dark" :dense="dense" :keep-color="keepColor" />

      <div class="label bg-secondary text-white">
        Custom true/false model value: <span class="right-detail"><em>{{ customChecked }}</em></span>
      </div>
      <q-checkbox v-model="customChecked" true-value="Custom Active" false-value="Custom Not Active" :dark="dark" :dense="dense" :keep-color="keepColor" label="Tap me" />

      <p class="caption">
        Disabled State
      </p>
      <q-checkbox v-model="checked" disable color="primary" label="Disabled Checkbox" :dark="dark" :dense="dense" :keep-color="keepColor" />
      <q-checkbox v-model="checked" disable color="accent" label="Disabled Checkbox" :dark="dark" :dense="dense" :keep-color="keepColor" />
      <q-checkbox v-model="checked" disable color="teal" label="Disabled Checkbox" :dark="dark" :dense="dense" :keep-color="keepColor" />

      <p class="caption">
        Array true/false val
      </p>
      <q-checkbox
        v-model="modelArr"
        :true-value="trueVal"
        :false-value="falseVal"
        color="primary"
        label="Array model"
        :dark="dark"
        :dense="dense"
        :keep-color="keepColor"
      />
      <div class="label bg-secondary text-white">
        Model is: {{ modelArr }}
      </div>
      <q-checkbox
        v-model="modelArrComplex"
        :val="trueVal"
        color="primary"
        label="Array model 1 - [true]"
        :dark="dark"
        :dense="dense"
        :keep-color="keepColor"
      />
      <q-checkbox
        v-model="modelArrComplex"
        :val="falseVal"
        color="primary"
        label="Array model 1 - [false]"
        :dark="dark"
        :dense="dense"
        :keep-color="keepColor"
      />
      <div class="label bg-secondary text-white">
        Model is: {{ modelArrComplex }}
      </div>

      <p class="caption">
        Option Group
      </p>
      <q-option-group
        inline
        type="checkbox"
        color="secondary"
        v-model="group"
        @update:model-value="onInput"
        :dark="dark" :dense="dense"
        :keep-color="keepColor"
        :options="[
          { label: 'Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 ', value: 'op2' },
          { label: 'Option 3', value: 'op3' },
          { label: 'Option 4', value: 'op4' }
        ]"
      />

      <p class="caption">
        Another Option Group
      </p>
      <q-option-group
        type="checkbox"
        v-model="group"
        @focus="onFocus"
        @blur="onBlur"
        :dark="dark" :dense="dense"
        :keep-color="keepColor"
        :options="[
          { label: 'Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 ', value: 'op2', dark, keepColor },
          { label: 'Option 3', value: 'op3', dark, keepColor },
          { label: 'Option 4', value: 'op4', dark, keepColor }
        ]"
      />

      <p class="caption">
        Inside a Label
      </p>
      <div class="column q-gutter-y-sm">
        <label>
          <q-checkbox v-model="checked" color="orange" label="Checkbox - own label" :dark="dark" :dense="dense" :keep-color="keepColor" />
        </label>

        <label tabindex="0">
          <q-checkbox v-model="checked" color="orange" label="Checkbox - own label (tabindex)" :dark="dark" :dense="dense" :keep-color="keepColor" />
        </label>

        <label>
          <q-checkbox v-model="checked" color="orange" :dark="dark" :dense="dense" :keep-color="keepColor" />
          Checkbox - external label
        </label>

        <label tabindex="0">
          <q-checkbox v-model="checked" color="orange" :dark="dark" :dense="dense" :keep-color="keepColor" />
          Checkbox - external label (tabindex)
        </label>

        <q-field v-model="checked" label="Checkbox field" stack-label :dark="dark" :dense="dense">
          <template v-slot:control="{ value, emitValue }">
            <q-checkbox
              :model-value="value"
              @update:model-value="emitValue"
              color="orange"
              :dark="dark"
              :dense="dense"
              :keep-color="keepColor"
            />
          </template>
        </q-field>
      </div>

      <p class="caption">
        Inside a List
      </p>
      <q-list :dark="dark" :dense="dense">
        <q-item tag="label">
          <q-item-section avatar>
            <q-checkbox @change="onChange" v-model="checked" :dark="dark" :dense="dense" :keep-color="keepColor" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Notification</q-item-label>
          </q-item-section>
        </q-item>
        <q-item tag="label">
          <q-item-section avatar>
            <q-checkbox @change="onChange" v-model="checked" :dark="dark" :dense="dense" :keep-color="keepColor" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Notification</q-item-label>
            <q-item-label caption>
              Allow notification
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item tag="label">
          <q-item-section avatar>
            <q-checkbox @change="onChange" v-model="checked" :dark="dark" :dense="dense" :keep-color="keepColor" />
          </q-item-section>
          <q-item-section>
            <q-item-label label>
              Notification
            </q-item-label>
            <q-item-label caption>
              Allow notifications Allow notifications Allow notifications Allow notifications Allow notifications
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    const
      trueVal = [ true ],
      falseVal = [ false ]

    return {
      val: true,
      ind: false,
      checked: true,
      orderModel: 'bogus',
      group: [ 'op2' ],
      selection: [ 'one', 'two', 'three' ],
      dark: null,
      dense: false,
      keepColor: false,
      indModel: null,
      customChecked: 'Custom Not Active',
      trueVal,
      falseVal,
      modelArr: falseVal,
      modelArrComplex: [ falseVal, trueVal ]
    }
  },
  watch: {
    group (val, old) {
      console.log(`Changed from ${ JSON.stringify(old) } to ${ JSON.stringify(val) }`)
    }
  },
  methods: {
    onChange (val) {
      console.log('@change', JSON.stringify(val))
    },
    onInput (val) {
      console.log('@update:model-value', JSON.stringify(val))
    },
    onFocus () {
      console.log('focused')
    },
    onBlur () {
      console.log('blur')
    }
  }
}
</script>
