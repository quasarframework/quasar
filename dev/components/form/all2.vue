<template>
  <div>
    <div class="layout-padding">
      <div class="q-pa-md" :class="dark ? 'bg-black' : null">
        <q-input :readonly="readonly" :disable="disable" :dark="dark" color="warning" class="q-my-sm" v-model="text" placeholder="Placeholder" float-label="With placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-input :readonly="readonly" :disable="disable" :dark="dark" inverted-light color="warning" class="q-my-sm" v-model="text" placeholder="Placeholder" float-label="With placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-input :readonly="readonly" :disable="disable" :dark="dark" warning class="q-my-sm" v-model="text" placeholder="Placeholder" float-label="With placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-input :readonly="readonly" :disable="disable" :dark="dark" error class="q-my-sm" v-model="text" placeholder="Placeholder" float-label="With placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-input :readonly="readonly" :disable="disable" :dark="dark" inverted warning class="q-my-sm" v-model="text" placeholder="Placeholder" float-label="With placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-input :readonly="readonly" :disable="disable" :dark="dark" inverted error class="q-my-sm" v-model="text" placeholder="Placeholder" float-label="With placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-input :readonly="readonly" :disable="disable" :dark="dark" inverted-light warning class="q-my-sm" v-model="text" placeholder="Placeholder" float-label="With placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-input :readonly="readonly" :disable="disable" :dark="dark" inverted-light error class="q-my-sm" v-model="text" placeholder="Placeholder" float-label="With placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-input :readonly="readonly" :disable="disable" :dark="dark" inverted-light error class="q-my-sm" v-model="text" placeholder="Placeholder" float-label="With placeholder" clearable suffix="SUF" prefix="PRE" />

        <br><br>

        <q-input :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="text" stack-label="Stack Label" clearable />
        <q-input :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="text" stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-input :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="text" float-label="Float Label" clearable suffix="SUF" prefix="PRE" />
        <q-input :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="text" placeholder="Placeholder" float-label="With placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-input :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="text" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-input :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" color="amber-2" v-model="text" stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-input :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="text" inverted stack-label="Stack Label" clearable />
        <q-input :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="text" inverted stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-input :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="text" inverted color="secondary" stack-label="With placeholder" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-input :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" color="amber-2" v-model="text" inverted-light stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-input :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" color="amber-2" v-model="text" inverted-light float-label="With placeholder" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-input :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" color="white" v-model="text" inverted-light stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />

        <br>

        <q-search :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="text" stack-label="Stack Label" clearable />
        <q-search :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="text" stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-search :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="text" float-label="Float Label" clearable suffix="SUF" prefix="PRE" />
        <q-search :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="text" placeholder="Placeholder" float-label="With placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-search :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="text" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-search :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" color="amber-2" v-model="text" stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-search :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="text" inverted stack-label="Stack Label" clearable />
        <q-search :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="text" inverted stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-search :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="text" inverted color="secondary" stack-label="With placeholder" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-search :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" color="amber-2" v-model="text" inverted-light stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-search :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" color="amber-2" v-model="text" inverted-light float-label="With placeholder" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-search :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" color="white" v-model="text" inverted-light stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />

        <br>

        <q-select :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="select" :options="selectOptions" stack-label="Stack Label" clearable />
        <q-select :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="select" :options="selectOptions" stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-select :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="select" :options="selectOptions" float-label="Float Label" clearable suffix="SUF" prefix="PRE" />
        <q-select :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="select" :options="selectOptions" placeholder="Placeholder" float-label="With placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-select :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="select" :options="selectOptions" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-select :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" color="amber-2" v-model="select" :options="selectOptions" stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-select :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="select" :options="selectOptions" inverted stack-label="Stack Label" clearable />
        <q-select :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="select" :options="selectOptions" inverted stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-select :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="select" :options="selectOptions" inverted color="secondary" stack-label="With placeholder" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-select :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" color="amber-2" v-model="select" :options="selectOptions" inverted-light stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-select :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" color="amber-2" v-model="select" :options="selectOptions" inverted-light float-label="With placeholder" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-select :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" color="white" v-model="select" :options="selectOptions" inverted-light stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />

        <br>

        <q-datetime :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="date" stack-label="Stack Label" clearable />
        <q-datetime :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="date" stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-datetime :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="date" float-label="Float Label" clearable suffix="SUF" prefix="PRE" />
        <q-datetime :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="date" placeholder="Placeholder" float-label="With placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-datetime :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="date" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-datetime :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" color="amber-2" v-model="date" stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-datetime :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="date" inverted stack-label="Stack Label" clearable />
        <q-datetime :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="date" inverted stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-datetime :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="date" inverted color="secondary" stack-label="With placeholder" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-datetime :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" color="amber-2" v-model="date" inverted-light stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-datetime :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" color="amber-2" v-model="date" inverted-light float-label="With placeholder" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-datetime :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" color="white" v-model="date" inverted-light stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />

        <br>

        <q-color :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="color" stack-label="Stack Label" clearable />
        <q-color :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="color" stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-color :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="color" float-label="Float Label" clearable suffix="SUF" prefix="PRE" />
        <q-color :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="color" placeholder="Placeholder" float-label="With placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-color :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="color" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-color :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" color="amber-2" v-model="color" stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-color :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="color" inverted stack-label="Stack Label" clearable />
        <q-color :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="color" inverted stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-color :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="color" inverted color="secondary" stack-label="With placeholder" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-color :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" color="amber-2" v-model="color" inverted-light stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-color :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" color="amber-2" v-model="color" inverted-light float-label="With placeholder" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-color :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" color="white" v-model="color" inverted-light stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />

        <br>

        <q-chips-input :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="chips" stack-label="Stack Label" clearable />
        <q-chips-input :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="chips" stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-chips-input :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="chips" float-label="Float Label" clearable suffix="SUF" prefix="PRE" />
        <q-chips-input :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="chips" placeholder="Placeholder" float-label="With placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-chips-input :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="chips" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-chips-input :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" color="amber-2" v-model="chips" stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-chips-input :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" color="amber-2" v-model="chips" stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-chips-input :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="chips" inverted stack-label="Stack Label" clearable />
        <q-chips-input :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="chips" inverted stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-chips-input :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" v-model="chips" inverted color="secondary" stack-label="With placeholder" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-chips-input :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" color="amber-2" v-model="chips" inverted-light stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-chips-input :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" color="amber-2" v-model="chips" inverted-light float-label="With placeholder" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-chips-input :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" color="white" v-model="chips" inverted-light stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-chips-input :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" inverted color="grey-10" v-model="chips" stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-chips-input :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" inverted color="orange" v-model="chips" stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-chips-input :readonly="readonly" :disable="disable" :dark="dark" class="q-my-sm" color="orange" v-model="chips" stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
      </div>
      <div class="fixed-top-left bg-grey-5 q-pa-sm" style="top: 18px; left: 18px;">
        <q-toggle v-model="dark" label="Dark" />
        <q-toggle v-model="readonly" label="Readonly" />
        <q-toggle v-model="disable" label="Disable" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: '',

      dark: false,
      readonly: false,
      disable: false,

      date: new Date(),
      chips: ['Jim', 'Joe'],
      color: '#fefefe',

      select: null,
      selectOptions: [
        {label: 'Option 1', value: 'opt1'},
        {label: 'Option 2', value: 'opt2'},
        {label: 'Option 3', value: 'opt3'}
      ]
    }
  }
}
</script>
