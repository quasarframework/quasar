<template>
  <div>
    <div class="q-layout-padding" :class="dark ? 'bg-black text-white' : ''">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{ option }}</em></span>
      </div>
      <q-toggle v-model="dark" :dark="dark" :dense="dense" label="Dark" :false-value="null" />
      <q-toggle v-model="keepColor" :dark="dark" :dense="dense" label="Keep Color" />
      <q-toggle v-model="dense" :dark="dark" :dense="dense" label="Dense" />

      <p class="caption">
        Standalone
      </p>
      <div class="q-gutter-md">
        <q-radio @change="onChange" @update:model-value="onInput" v-model="option" val="opt1" :dark="dark" :dense="dense" :keep-color="keepColor" />
        <q-radio @change="onChange" @update:model-value="onInput" v-model="option" val="opt2" label="Option 2" :dark="dark" :dense="dense" :keep-color="keepColor" />
        <q-radio @change="onChange" @update:model-value="onInput" v-model="option" val="opt3" color="teal" label="Option 3" :dark="dark" :dense="dense" :keep-color="keepColor" />
        <q-radio @change="onChange" @update:model-value="onInput" v-model="option" val="opt4" color="orange" label="Option 4" :dark="dark" :dense="dense" :keep-color="keepColor" />
      </div>

      <p class="caption">
        Sizes
      </p>
      <q-radio
        v-for="size in ['xs', 'sm', 'md', 'lg', 'xl', '150px']"
        :key="size"
        :size="size"
        :label="size"
        v-model="option" val="opt1" :dark="dark" :dense="dense" :keep-color="keepColor"
      />

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
        @update:model-value="onInput"
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
        Inside a Label
      </p>
      <div class="column q-gutter-y-sm">
        <div class="row q-col-gutter-x-sm">
          <label class="col">
            <q-radio v-model="option" val="opt1" color="orange" label="Radio Opt 1 - own label" :dark="dark" :dense="dense" :keep-color="keepColor" />
          </label>
          <label class="col">
            <q-radio v-model="option" val="opt2" color="orange" label="Radio Opt 2 - own label" :dark="dark" :dense="dense" :keep-color="keepColor" />
          </label>
        </div>

        <q-separator />

        <div class="row q-col-gutter-x-sm">
          <label tabindex="0" class="col">
            <q-radio v-model="option" val="opt1" color="orange" label="Radio Opt 1 - own label (tabindex)" :dark="dark" :dense="dense" :keep-color="keepColor" />
          </label>
          <label tabindex="0" class="col">
            <q-radio v-model="option" val="opt2" color="orange" label="Radio Opt 2 - own label (tabindex)" :dark="dark" :dense="dense" :keep-color="keepColor" />
          </label>
        </div>

        <q-separator />

        <div class="row q-col-gutter-x-sm">
          <label class="col">
            <q-radio v-model="option" val="opt1" color="orange" :dark="dark" :dense="dense" :keep-color="keepColor" />
            Radio Opt 1 - external label
          </label>
          <label class="col">
            <q-radio v-model="option" val="opt2" color="orange" :dark="dark" :dense="dense" :keep-color="keepColor" />
            Radio Opt 2 - external label
          </label>
        </div>

        <q-separator />

        <div class="row q-col-gutter-x-sm">
          <label tabindex="0" class="col">
            <q-radio v-model="option" val="opt1" color="orange" :dark="dark" :dense="dense" :keep-color="keepColor" />
            Radio Opt 1 - external label (tabindex)
          </label>
          <label tabindex="0" class="col">
            <q-radio v-model="option" val="opt2" color="orange" :dark="dark" :dense="dense" :keep-color="keepColor" />
            Radio Opt 2 - external label (tabindex)
          </label>
        </div>

        <q-separator />

        <div class="row q-col-gutter-x-sm">
          <q-field v-model="option" label="Radio Opt 1 field" stack-label :dark="dark" :dense="dense" class="col">
            <template v-slot:control="{ id, value, emitValue }">
              <q-radio
                :for="id"
                :model-value="value"
                val="opt1"
                @update:model-value="emitValue"
                color="orange"
                :dark="dark"
                :dense="dense"
                :keep-color="keepColor"
              />
            </template>
          </q-field>
          <q-field v-model="option" label="Radio Opt 2 field" stack-label :dark="dark" :dense="dense" class="col">
            <template v-slot:control="{ value, emitValue }">
              <q-radio
                :model-value="value"
                val="opt2"
                @update:model-value="emitValue"
                color="orange"
                :dark="dark"
                :dense="dense"
                :keep-color="keepColor"
              />
            </template>
          </q-field>
        </div>
      </div>

      <p class="caption">
        Inside a List
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
      dark: null,
      dense: false,
      keepColor: false
    }
  },
  watch: {
    option (val, old) {
      console.log(`Changed from ${ JSON.stringify(old) } to ${ JSON.stringify(val) }`)
    },
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
    }
  }
}
</script>

<style>
</style>
