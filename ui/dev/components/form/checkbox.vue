<template>
  <div>
    <div class="q-layout-padding" :class="`bg-${dark ? 'black' : 'white'}${dark ? ' text-white' : ''}`">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{ checked }}</em></span>
      </div>
      <q-toggle v-model="dark" :dark="dark" :dense="dense" label="Dark" />
      <q-toggle v-model="keepColor" :dark="dark" :dense="dense" label="Keep Color" />
      <q-toggle v-model="dense" :dark="dark" :dense="dense" label="Dense" />

      <p class="caption">
        Standalone
      </p>
      <q-checkbox v-model="checked" checked-icon="sentiment very satisfied" unchecked-icon="sentiment very dissatisfied" indeterminate-icon="help" :dark="dark" :dense="dense" :keep-color="keepColor" />
      <q-checkbox v-model="checked" checked-icon="visibility" unchecked-icon="visibility_off" style="margin-left: 50px" :dark="dark" :dense="dense" :keep-color="keepColor" />

      <p class="caption">
        Indeterminate
      </p>
      <q-checkbox v-model="indModel" toggle-indeterminate :dark="dark" :dense="dense" :keep-color="keepColor" label="Tap me to change between 3 states" />

      <p class="caption">
        Tests
      </p>
      <q-checkbox @change="onChange" @input="onInput" v-model="checked" :dark="dark" :dense="dense" :keep-color="keepColor" />
      <q-checkbox v-model="checked" label="Label" :dark="dark" :dense="dense" :keep-color="keepColor" />

      <q-checkbox v-model="checked" label="Checkbox Label" :dark="dark" :dense="dense" :keep-color="keepColor" />
      <q-checkbox v-model="checked" no-focus color="teal" label="Checkbox Label - skip focus" :dark="dark" :dense="dense" :keep-color="keepColor" />
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
        Option Group
      </p>
      <q-option-group
        inline
        type="checkbox"
        color="secondary"
        v-model="group"
        @input="onInput"
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
        Inside of a List
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
    return {
      val: true,
      ind: false,
      checked: true,
      group: ['op2'],
      selection: ['one', 'two', 'three'],
      dark: false,
      dense: false,
      keepColor: false,
      indModel: null,
      customChecked: 'Custom Not Active'
    }
  },
  watch: {
    group (val, old) {
      console.log(`Changed from ${JSON.stringify(old)} to ${JSON.stringify(val)}`)
    }
  },
  methods: {
    onChange (val) {
      console.log('@change', JSON.stringify(val))
    },
    onInput (val) {
      console.log('@input', JSON.stringify(val))
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
