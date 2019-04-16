<template>
  <div>
    <div class="q-layout-padding" :class="`bg-${dark ? 'black' : 'white'}${dark ? ' text-white' : ''}`">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{ option }}</em></span>
      </div>
      <q-toggle v-model="dark" :dark="dark" :dense="dense" label="Dark" />
      <q-toggle v-model="keepColor" :dark="dark" :dense="dense" label="Keep Color" />
      <q-toggle v-model="dense" :dark="dark" :dense="dense" label="Dense" />

      <p class="caption">
        Standalone
      </p>
      <div class="q-gutter-md">
        <q-radio @change="onChange" @input="onInput" v-model="option" val="opt1" :dark="dark" :dense="dense" :keep-color="keepColor" />
        <q-radio @change="onChange" @input="onInput" v-model="option" val="opt2" label="Option 2" :dark="dark" :dense="dense" :keep-color="keepColor" />
        <q-radio @change="onChange" @input="onInput" v-model="option" val="opt3" color="teal" label="Option 3" :dark="dark" :dense="dense" :keep-color="keepColor" />
        <q-radio @change="onChange" @input="onInput" v-model="option" val="opt4" color="orange" label="Option 4" :dark="dark" :dense="dense" :keep-color="keepColor" />
      </div>

      <p class="caption">
        Label on the left side
      </p>
      <div class="q-gutter-md">
        <q-radio v-model="option" val="opt2" left-label label="Option 2" :dark="dark" :dense="dense" :keep-color="keepColor" />
        <q-radio v-model="option" val="opt3" left-label color="teal" label="Option 3" :dark="dark" :dense="dense" :keep-color="keepColor" />
        <q-radio v-model="option" val="opt4" left-label color="orange" label="Option 4" :dark="dark" :dense="dense" :keep-color="keepColor" />
      </div>

      <p class="caption">
        Disabled State
      </p>
      <q-radio v-model="option" val="opt1" disable color="primary" label="Disabled Option 1" :dark="dark" :dense="dense" :keep-color="keepColor" />
      <q-radio v-model="option" val="opt2" disable color="accent" label="Disabled Option 2" :dark="dark" :dense="dense" :keep-color="keepColor" />
      <q-radio v-model="option" val="opt3" disable color="teal" label="Disabled Option 3" :dark="dark" :dense="dense" :keep-color="keepColor" />

      <p class="caption">
        Option Group
      </p>
      <q-option-group
        type="radio"
        v-model="group"
        @change="onChange"
        @input="onInput"
        :dark="dark" :dense="dense"
        :keep-color="keepColor"
        :options="[
          { label: 'Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 ', value: 'op2' },
          { label: 'Option 3', value: 'op3', color: 'secondary' },
          { label: 'Option 4', value: 'op4', color: 'amber' }
        ]"
      />

      <p class="caption">
        Another Option Group
      </p>
      <q-option-group
        inline
        v-model="group"
        :dark="dark" :dense="dense"
        :keep-color="keepColor"
        :options="[
          { label: 'Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 Option 2 ', value: 'op2', dark, keepColor },
          { label: 'Option 3', value: 'op3', color: 'secondary', dark, keepColor },
          { label: 'Option 4', value: 'op4', color: 'amber', dark, keepColor }
        ]"
      />

      <p class="caption">
        Inside of a List
      </p>
      <q-list :dark="dark" :dense="dense">
        <q-item tag="label">
          <q-item-section avatar>
            <q-radio @change="onChange" v-model="option" val="opt1" :dark="dark" :dense="dense" :keep-color="keepColor" />
          </q-item-section>
          <q-item-section>
            Option 1
          </q-item-section>
        </q-item>
        <q-item tag="label">
          <q-item-section avatar>
            <q-radio @change="onChange" v-model="option" val="opt2" :dark="dark" :dense="dense" :keep-color="keepColor" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Option 2</q-item-label>
            <q-item-label caption>
              Allows notifications
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item tag="label">
          <q-item-section avatar>
            <q-radio @change="onChange" v-model="option" val="opt3" :dark="dark" :dense="dense" :keep-color="keepColor" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Option 3</q-item-label>
            <q-item-label caption>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
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
      option: 'opt1',
      group: 'op3',
      dark: false,
      dense: false,
      keepColor: false
    }
  },
  watch: {
    option (val, old) {
      console.log(`Changed from ${JSON.stringify(old)} to ${JSON.stringify(val)}`)
    },
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
    }
  }
}
</script>

<style>
</style>
