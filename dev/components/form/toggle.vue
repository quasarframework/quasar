<template>
  <div>
    <div class="q-layout-padding" :class="`bg-${dark ? 'black' : 'white'}${dark ? ' text-white' : ''}`">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{ checked }}</em></span>
      </div>
      <q-toggle v-model="dark" :dark="dark" label="Dark" />
      <q-toggle v-model="keepColor" :dark="dark" label="Keep Color" />

      <p class="caption">Standalone</p>
      <q-toggle @change="onChange" @input="onInput" v-model="checked" :dark="dark" :keep-color="keepColor" />
      <q-toggle v-model="checked" label="Toggle Label" :dark="dark" :keep-color="keepColor" />
      <q-toggle v-model="checked" color="orange" label="Toggle Label" :dark="dark" :keep-color="keepColor" />
      <q-toggle v-model="checked" color="teal" label="Toggle Label" :dark="dark" :keep-color="keepColor" />

      <p class="caption">Label on the left side</p>
      <q-toggle v-model="checked" color="orange" left-label label="Toggle Label" :dark="dark" :keep-color="keepColor" />
      <q-toggle v-model="checked" color="teal" left-label label="Toggle Label" :dark="dark" :keep-color="keepColor" />
      <q-toggle v-model="checked" color="blue" left-label label="Toggle Label" :dark="dark" :keep-color="keepColor" />

      <p class="caption">Array Model</p>
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{ selection }}</em></span>
      </div>

      <q-toggle @change="onChange" v-model="selection" val="one" label="One" :dark="dark" :keep-color="keepColor" />
      <br>
      <q-toggle @change="onChange" v-model="selection" val="two" label="Two" :dark="dark" :keep-color="keepColor" />
      <br>
      <q-toggle @change="onChange" v-model="selection" val="three" label="Three" :dark="dark" :keep-color="keepColor" />

      <p class="caption">With Icon</p>
      <q-toggle v-model="checked" icon="alarm" label="Toggle Label" :dark="dark" :keep-color="keepColor" />
      <q-toggle v-model="checked" icon="mail" color="secondary" label="Toggle Label" :dark="dark" :keep-color="keepColor" />
      <q-toggle v-model="checked" unchecked-icon="visibility_off" checked-icon="visibility" color="red" label="Toggle Label" :dark="dark" :keep-color="keepColor" />

      <p class="caption">Disabled State</p>
      <q-toggle v-model="checked" disable label="Toggle Label" :dark="dark" :keep-color="keepColor" />

      <p class="caption">Option Group</p>
      <q-option-group
        inline
        type="toggle"
        v-model="group"
        @change="onChange"
        @input="onInput"
        :dark="dark"
        :keep-color="keepColor"
        :options="[
          { label: 'Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 ', value: 'op2' },
          { label: 'Option 3', value: 'op3', color: 'secondary' },
          { label: 'Option 4', value: 'op4', color: 'tertiary' }
        ]"
      />

      <p class="caption">Another Option Group</p>
      <q-option-group
        type="toggle"
        v-model="group"
        :options="[
          { label: 'Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 ', value: 'op2', dark, keepColor },
          { label: 'Option 3', value: 'op3', dark, keepColor },
          { label: 'Option 4', value: 'op4', dark, keepColor }
        ]"
      />

      <p class="caption">Inside of a List</p>
      <q-list :dark="dark">
        <q-item tag="label">
          <q-item-section>
            <q-item-label>Events and reminders</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle v-model="checked" :dark="dark" :keep-color="keepColor" />
          </q-item-section>
        </q-item>
        <q-item tag="label" multiline>
          <q-item-section>
            <q-item-label>Events and reminders</q-item-label>
            <q-item-label caption>Lorem ipsum</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle v-model="checked" class="purple" :dark="dark" :keep-color="keepColor" />
          </q-item-section>
        </q-item>
        <q-item tag="label" multiline>
          <q-item-section>
            <q-item-label>Events and reminders</q-item-label>
            <q-item-label caption>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle v-model="checked" class="red" :dark="dark" :keep-color="keepColor" />
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
      checked: true,
      group: ['op3'],
      selection: ['two'],
      dark: false,
      keepColor: false
    }
  },
  watch: {
    checked (val, old) {
      console.log(`Changed from ${JSON.stringify(old)} to ${JSON.stringify(val)}`)
    },
    group (val, old) {
      console.log(`Changed from ${JSON.stringify(old)} to ${JSON.stringify(val)}`)
    },
    selection (val, old) {
      console.log(`Changed from ${JSON.stringify(old)} to ${JSON.stringify(val)}`)
    }
  },
  methods: {
    onChange (val) {
      console.log('@change', JSON.stringify(val))
    },
    onInput (val) {
      console.log('@input', JSON.stringify(val))
    }
  }
}
</script>
