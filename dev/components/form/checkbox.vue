<template>
  <div>
    <div class="q-layout-padding" :class="`bg-${dark ? 'black' : 'white'}${dark ? ' text-white' : ''}`">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{ checked }}</em></span>
      </div>
      <q-toggle v-model="dark" :dark="dark" label="Dark" />
      <q-toggle v-model="keepColor" :dark="dark" label="Keep Color" />

      <p class="caption">Standalone</p>
      <q-checkbox v-model="checked" checked-icon="sentiment very satisfied" unchecked-icon="sentiment very dissatisfied" indeterminate-icon="help" :dark="dark" :keep-color="keepColor" />
      <q-checkbox v-model="checked" checked-icon="visibility" unchecked-icon="visibility_off" style="margin-left: 50px" :dark="dark" :keep-color="keepColor" />

      <p class="caption">Indeterminate</p>
      <q-checkbox v-model="indModel" toggle-indeterminate :dark="dark" :keep-color="keepColor" label="Tap me to change between 3 states" />

      <p class="caption">Tests</p>
      <q-checkbox @change="onChange" @input="onInput" v-model="checked" :dark="dark" :keep-color="keepColor" />
      <q-checkbox v-model="checked" label="Label" :dark="dark" :keep-color="keepColor" />

      <q-checkbox v-model="checked" label="Checkbox Label" :dark="dark" :keep-color="keepColor" />
      <q-checkbox v-model="checked" no-focus color="teal" label="Checkbox Label - skip focus" :dark="dark" :keep-color="keepColor" />
      <q-checkbox v-model="checked" color="orange" label="Checkbox Label" :dark="dark" :keep-color="keepColor" />

      <p class="caption">Label on the left side</p>
      <q-checkbox v-model="checked" color="teal" left-label label="Checkbox Label" :dark="dark" :keep-color="keepColor" />
      <q-checkbox v-model="checked" color="orange" left-label label="Checkbox Label" :dark="dark" :keep-color="keepColor" />
      <q-checkbox v-model="checked" color="dark" left-label label="Checkbox Label" :dark="dark" :keep-color="keepColor" />

      <p class="caption">Array Model</p>
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{ selection }}</em></span>
      </div>

      <q-checkbox @change="onChange" v-model="selection" val="one" label="One" :dark="dark" :keep-color="keepColor" />
      <q-checkbox @change="onChange" v-model="selection" val="two" label="Two" :dark="dark" :keep-color="keepColor" />
      <q-checkbox @change="onChange" v-model="selection" val="three" label="Three" :dark="dark" :keep-color="keepColor" />

      <div class="label bg-secondary text-white">
        Custom true/false model value: <span class="right-detail"><em>{{ customChecked }}</em></span>
      </div>
      <q-checkbox v-model="customChecked" true-value="Custom Active" false-value="Custom Not Active" :dark="dark" :keep-color="keepColor" label="Tap me" />

      <p class="caption">Disabled State</p>
      <q-checkbox v-model="checked" disable label="Disabled Checkbox" :dark="dark" :keep-color="keepColor" />

      <p class="caption">Inside of a List</p>
      <q-list :dark="dark">
        <q-item tag="label">
          <q-item-section avatar>
            <q-checkbox @change="onChange" v-model="checked" :dark="dark" :keep-color="keepColor"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Notification</q-item-label>
          </q-item-section>
        </q-item>
        <q-item tag="label">
          <q-item-section avatar>
            <q-checkbox @change="onChange" v-model="checked" :dark="dark" :keep-color="keepColor"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Notification</q-item-label>
            <q-item-label caption>Allow notification</q-item-label>
          </q-item-section>
        </q-item>
        <q-item tag="label">
          <q-item-section avatar>
            <q-checkbox @change="onChange" v-model="checked" :dark="dark" :keep-color="keepColor"/>
          </q-item-section>
          <q-item-section>
            <q-item-label label>Notification</q-item-label>
            <q-item-label caption>Allow notifications Allow notifications Allow notifications Allow notifications Allow notifications</q-item-label>
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
