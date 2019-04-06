<template>
  <div class="q-layout-padding" :class="`bg-${dark ? 'black' : 'white'}${dark ? ' text-white' : ''}`">
    <q-toggle v-model="keepColor" label="Keep color" :dark="dark" />
    <q-toggle v-model="disable" label="Disable" :dark="dark" />
    <q-toggle v-model="dark" label="Dark" :dark="dark" />

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
  </div>
</template>

<script>
export default {
  data () {
    return {
      keepColor: true,
      disable: true,
      dark: false,

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
