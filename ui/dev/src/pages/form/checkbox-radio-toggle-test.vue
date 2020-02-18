<template>
  <div class="q-layout-padding" :class="dark ? 'bg-black text-white' : ''">
    <q-toggle v-model="keepColor" label="Keep color" :dark="dark" />
    <q-toggle v-model="disable" label="Disable" :dark="dark" />
    <q-toggle v-model="dark" label="Dark" :dark="dark" :false-value="null" />

    <div class="q-my-lg">
      <q-radio v-model="option" val="opt1" :disable="disable" :dark="dark" color="primary" label="Disabled Option 1" :keep-color="keepColor" />
      <q-radio v-model="option" val="opt2" :disable="disable" :dark="dark" color="accent" label="Disabled Option 2" :keep-color="keepColor" />
      <q-radio v-model="option" val="opt3" :disable="disable" :dark="dark" color="teal" label="Disabled Option 3" :keep-color="keepColor" />
    </div>

    <div class="q-my-lg">
      <q-checkbox v-model="checked" :disable="disable" :dark="dark" color="primary" label="Disabled Checkbox" :keep-color="keepColor" />
      <q-checkbox v-model="checked2" :disable="disable" :dark="dark" color="accent" label="Disabled Checkbox" :keep-color="keepColor" />
      <q-checkbox v-model="checked3" :disable="disable" :dark="dark" color="teal" label="Disabled Checkbox" :keep-color="keepColor" />
    </div>

    <div class="q-my-lg">
      <q-toggle v-model="checked" :disable="disable" :dark="dark" color="primary" label="Toggle Label" :keep-color="keepColor" />
      <q-toggle v-model="checked2" :disable="disable" :dark="dark" color="accent" label="Toggle Label" :keep-color="keepColor" />
      <q-toggle v-model="checked3" :disable="disable" :dark="dark" color="teal" label="Toggle Label" :keep-color="keepColor" />
    </div>

    <div class="row items-center q-mb-md">
      <span class="text-h6 q-mr-md">Sizes</span>
      <div>
        ( <q-toggle v-model="dense" label="Dense" :dark="dark" /> )
      </div>
    </div>
    <q-markup-table :dark="dark">
      <tbody>
        <tr v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="size">
          <td>
            <q-radio
              :size="size"
              :label="size"
              v-model="option" val="opt1" :dark="dark" :dense="dense" :keep-color="keepColor"
            />
          </td>
          <td>
            <q-checkbox
              :size="size"
              :label="size"
              v-model="checked" :dark="dark" :dense="dense" :keep-color="keepColor"
            />
          </td>
          <td>
            <q-toggle
              :size="size"
              :label="size"
              unchecked-icon="visibility_off" checked-icon="visibility"
              v-model="checked" :dark="dark" :dense="dense" :keep-color="keepColor"
            />
          </td>
        </tr>
      </tbody>
    </q-markup-table>

    <q-markup-table class="q-mt-lg" separator="cell" :dark="dark">
      <tbody>
        <tr>
          <td v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="size">
            <q-radio
              :size="size"
              :label="size"
              v-model="option" val="opt1" :dark="dark" :dense="dense" :keep-color="keepColor"
            />
          </td>
        </tr>
        <tr>
          <td v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="size">
            <q-checkbox
              :size="size"
              :label="size"
              v-model="checked" :dark="dark" :dense="dense" :keep-color="keepColor"
            />
          </td>
        </tr>
        <tr>
          <td v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="size">
            <q-toggle
              :size="size"
              :label="size"
              unchecked-icon="visibility_off" checked-icon="visibility"
              v-model="checked" :dark="dark" :dense="dense" :keep-color="keepColor"
            />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      keepColor: true,
      disable: true,
      dark: null,
      dense: false,

      checked: true,
      checked2: false,
      checked3: false,

      option: 'opt1'
    }
  },
  methods: {
  }
}
</script>
