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
      <q-toggle @change="onChange" @update:model-value="onInput" v-model="checked" :dark="dark" :dense="dense" :keep-color="keepColor" />
      <q-toggle v-model="checked" label="Toggle Label" :dark="dark" :dense="dense" :keep-color="keepColor" />
      <q-toggle v-model="checked" color="orange" label="Toggle Label" :dark="dark" :dense="dense" :keep-color="keepColor" />
      <q-toggle v-model="checked" color="teal" label="Toggle Label" :dark="dark" :dense="dense" :keep-color="keepColor" />

      <p class="caption">
        Sizes
      </p>
      <div>
        <q-toggle
          v-for="size in ['xs', 'sm', 'md', 'lg', 'xl', '150px']"
          :key="size"
          :size="size"
          :label="size"
          unchecked-icon="visibility_off" checked-icon="visibility"
          v-model="checked" :dark="dark" :dense="dense" :keep-color="keepColor"
        />
      </div>
      <div>
        <q-toggle
          v-for="size in ['xs', 'sm', 'md', 'lg', 'xl', '150px']"
          :key="size"
          :size="size"
          :label="size"
          :unchecked-icon="mdiEyeOff" :checked-icon="mdiEye"
          v-model="checked" :dark="dark" :dense="dense" :keep-color="keepColor"
        />
      </div>

      <p class="caption">
        Indeterminate
      </p>
      <q-toggle v-model="indModel" toggle-indeterminate :dark="dark" :dense="dense" :keep-color="keepColor" label="Three states" />
      <q-toggle v-model="indModel" toggle-indeterminate :dark="dark" :dense="dense" keep-color label="Three states" />
      <q-toggle v-model="indModel" toggle-indeterminate :dark="dark" :dense="dense" :keep-color="keepColor" color="orange" unchecked-icon="visibility_off" checked-icon="visibility" indeterminate-icon="help" label="Three states" />
      <q-toggle v-model="indModel" toggle-indeterminate :dark="dark" :dense="dense" keep-color color="orange" unchecked-icon="visibility_off" checked-icon="visibility" indeterminate-icon="help" label="Three states" size="100px" />

      <p class="caption">
        Indeterminate + icon-color
      </p>
      <q-toggle v-model="indModel" toggle-indeterminate :dark="dark" :dense="dense" :keep-color="keepColor" unchecked-icon="visibility_off" checked-icon="visibility" indeterminate-icon="help" label="Three states" icon-color="red" />
      <q-toggle v-model="indModel" toggle-indeterminate :dark="dark" :dense="dense" :keep-color="keepColor" unchecked-icon="visibility_off" checked-icon="visibility" indeterminate-icon="help" label="Three states" icon-color="red" />
      <q-toggle v-model="indModel" toggle-indeterminate :dark="dark" :dense="dense" keep-color color="orange" unchecked-icon="visibility_off" checked-icon="visibility" indeterminate-icon="help" label="Three states" size="100px" icon-color="black" />

      <p class="caption">
        Label on the left side
      </p>
      <q-toggle v-model="checked" color="orange" left-label label="Toggle Label" :dark="dark" :dense="dense" :keep-color="keepColor" />
      <q-toggle v-model="checked" color="teal" left-label label="Toggle Label" :dark="dark" :dense="dense" :keep-color="keepColor" />
      <q-toggle v-model="checked" color="blue" left-label label="Toggle Label" :dark="dark" :dense="dense" :keep-color="keepColor" />

      <p class="caption">
        Array Model
      </p>
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{ selection }}</em></span>
      </div>

      <q-toggle @change="onChange" v-model="selection" val="one" label="One" :dark="dark" :dense="dense" :keep-color="keepColor" />
      <br>
      <q-toggle @change="onChange" v-model="selection" val="two" label="Two" :dark="dark" :dense="dense" :keep-color="keepColor" />
      <br>
      <q-toggle @change="onChange" v-model="selection" val="three" label="Three" :dark="dark" :dense="dense" :keep-color="keepColor" />

      <p class="caption">
        With Icon
      </p>
      <q-toggle v-model="checked" icon="alarm" label="Toggle Label" :dark="dark" :dense="dense" :keep-color="keepColor" />
      <q-toggle v-model="checked" icon="mail" color="secondary" label="Toggle Label" :dark="dark" :dense="dense" :keep-color="keepColor" />
      <q-toggle v-model="checked" unchecked-icon="visibility_off" checked-icon="visibility" color="red" label="Toggle Label" :dark="dark" :dense="dense" :keep-color="keepColor" />

      <div>
        <q-toggle icon="fas fa-street-view" v-model="checked" />
        <q-toggle icon="map" v-model="checked" />
        <q-toggle icon="ion-compass" v-model="checked" />
        <q-toggle icon="mdi-account" v-model="checked" />
        <q-toggle icon="eva-alert-circle-outline" v-model="checked" />
        <q-toggle icon="ti-save" v-model="checked" />
        <q-toggle icon="las la-phone-volume" v-model="checked" />
      </div>

      <p class="caption">
        Disabled State
      </p>
      <q-toggle v-model="checked" disable color="primary" label="Toggle Label" :dark="dark" :dense="dense" :keep-color="keepColor" />
      <q-toggle v-model="checked" disable color="accent" label="Toggle Label" :dark="dark" :dense="dense" :keep-color="keepColor" />
      <q-toggle v-model="checked" disable color="teal" label="Toggle Label" :dark="dark" :dense="dense" :keep-color="keepColor" />

      <p class="caption">
        Option Group
      </p>
      <q-option-group
        inline
        type="toggle"
        v-model="group"
        @change="onChange"
        @update:model-value="onInput"
        :dark="dark" :dense="dense"
        :keep-color="keepColor"
        :options="[
          { label: 'Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 ', value: 'op2' },
          { label: 'Option 3', value: 'op3', color: 'secondary' },
          { label: 'Option 4', value: 'op4', color: 'accent' }
        ]"
      />

      <p class="caption">
        Another Option Group
      </p>
      <q-option-group
        type="toggle"
        v-model="group"
        size="lg"
        :dark="dark" dense
        :keep-color="keepColor"
        :options="[
          { label: 'Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 ', value: 'op2', dark, keepColor },
          { label: 'Option 3', value: 'op3', dark, keepColor },
          { label: 'Option 4', value: 'op4', dark, keepColor, size: 'xs' }
        ]"
      />

      <p class="caption">
        Inside a Label
      </p>
      <div class="column q-gutter-y-sm">
        <label>
          <q-toggle v-model="checked" color="orange" label="Toggle - own label" :dark="dark" :dense="dense" :keep-color="keepColor" />
        </label>

        <label tabindex="0">
          <q-toggle v-model="checked" color="orange" label="Toggle - own label (tabindex)" :dark="dark" :dense="dense" :keep-color="keepColor" />
        </label>

        <label>
          <q-toggle v-model="checked" color="orange" :dark="dark" :dense="dense" :keep-color="keepColor" />
          Toggle - external label
        </label>

        <label tabindex="0">
          <q-toggle v-model="checked" color="orange" :dark="dark" :dense="dense" :keep-color="keepColor" />
          Toggle - external label (tabindex)
        </label>

        <q-field v-model="checked" label="Toggle field" stack-label :dark="dark" :dense="dense">
          <template v-slot:control="{ value, emitValue }">
            <q-toggle
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
          <q-item-section>
            <q-item-label>Events and reminders</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle v-model="checked" :dark="dark" :dense="dense" :keep-color="keepColor" />
          </q-item-section>
        </q-item>
        <q-item tag="label" multiline>
          <q-item-section>
            <q-item-label>Events and reminders</q-item-label>
            <q-item-label caption>
              Lorem ipsum
            </q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle v-model="checked" class="purple" :dark="dark" :dense="dense" :keep-color="keepColor" />
          </q-item-section>
        </q-item>
        <q-item tag="label" multiline>
          <q-item-section>
            <q-item-label>Events and reminders</q-item-label>
            <q-item-label caption>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle v-model="checked" class="red" :dark="dark" :dense="dense" :keep-color="keepColor" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
import { mdiEye, mdiEyeOff } from '@quasar/extras/mdi-v4'

export default {
  created () {
    this.mdiEye = mdiEye
    this.mdiEyeOff = mdiEyeOff
  },
  data () {
    return {
      checked: true,
      group: [ 'op3' ],
      selection: [ 'two' ],
      indModel: null,
      dark: null,
      dense: false,
      keepColor: false
    }
  },
  watch: {
    checked (val, old) {
      console.log(`Changed from ${ JSON.stringify(old) } to ${ JSON.stringify(val) }`)
    },
    group (val, old) {
      console.log(`Changed from ${ JSON.stringify(old) } to ${ JSON.stringify(val) }`)
    },
    selection (val, old) {
      console.log(`Changed from ${ JSON.stringify(old) } to ${ JSON.stringify(val) }`)
    }
  },
  methods: {
    onChange (val) {
      console.log('@change', JSON.stringify(val))
    },
    onInput (val) {
      console.log('@update:model-value', JSON.stringify(val))
    }
  }
}
</script>
