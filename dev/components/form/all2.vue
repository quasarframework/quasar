<template>
  <div>
    <div class="layout-padding">
      <div class="q-pa-md" :class="dark ? 'bg-black' : null">
        <q-input :dark="dark" color="warning" class="q-my-sm" v-model="text" placeholder="Placeholder" float-label="With placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-input :dark="dark" inverted-light color="warning" class="q-my-sm" v-model="text" placeholder="Placeholder" float-label="With placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-input :dark="dark" warning class="q-my-sm" v-model="text" placeholder="Placeholder" float-label="With placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-input :dark="dark" error class="q-my-sm" v-model="text" placeholder="Placeholder" float-label="With placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-input :dark="dark" inverted warning class="q-my-sm" v-model="text" placeholder="Placeholder" float-label="With placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-input :dark="dark" inverted error class="q-my-sm" v-model="text" placeholder="Placeholder" float-label="With placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-input :dark="dark" inverted-light warning class="q-my-sm" v-model="text" placeholder="Placeholder" float-label="With placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-input :dark="dark" inverted-light error class="q-my-sm" v-model="text" placeholder="Placeholder" float-label="With placeholder" clearable suffix="SUF" prefix="PRE" />

        <br><br>

        <q-input :dark="dark" class="q-my-sm" v-model="text" stack-label="Stack Label" clearable />
        <q-input :dark="dark" class="q-my-sm" v-model="text" stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-input :dark="dark" class="q-my-sm" v-model="text" float-label="Float Label" clearable suffix="SUF" prefix="PRE" />
        <q-input :dark="dark" class="q-my-sm" v-model="text" placeholder="Placeholder" float-label="With placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-input :dark="dark" class="q-my-sm" v-model="text" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-input :dark="dark" class="q-my-sm" color="amber-2" v-model="text" stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-input :dark="dark" class="q-my-sm" v-model="text" inverted stack-label="Stack Label" clearable />
        <q-input :dark="dark" class="q-my-sm" v-model="text" inverted stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-input :dark="dark" class="q-my-sm" v-model="text" inverted color="secondary" stack-label="With placeholder" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-input :dark="dark" class="q-my-sm" color="amber-2" v-model="text" inverted-light stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-input :dark="dark" class="q-my-sm" color="amber-2" v-model="text" inverted-light float-label="With placeholder" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-input :dark="dark" class="q-my-sm" color="white" v-model="text" inverted-light stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />

        <br>

        <q-search :dark="dark" class="q-my-sm" v-model="text" stack-label="Stack Label" clearable />
        <q-search :dark="dark" class="q-my-sm" v-model="text" stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-search :dark="dark" class="q-my-sm" v-model="text" float-label="Float Label" clearable suffix="SUF" prefix="PRE" />
        <q-search :dark="dark" class="q-my-sm" v-model="text" placeholder="Placeholder" float-label="With placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-search :dark="dark" class="q-my-sm" v-model="text" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-search :dark="dark" class="q-my-sm" color="amber-2" v-model="text" stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-search :dark="dark" class="q-my-sm" v-model="text" inverted stack-label="Stack Label" clearable />
        <q-search :dark="dark" class="q-my-sm" v-model="text" inverted stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-search :dark="dark" class="q-my-sm" v-model="text" inverted color="secondary" stack-label="With placeholder" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-search :dark="dark" class="q-my-sm" color="amber-2" v-model="text" inverted-light stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-search :dark="dark" class="q-my-sm" color="amber-2" v-model="text" inverted-light float-label="With placeholder" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-search :dark="dark" class="q-my-sm" color="white" v-model="text" inverted-light stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />

        <br>

        <q-datetime :dark="dark" class="q-my-sm" v-model="date" stack-label="Stack Label" clearable />
        <q-datetime :dark="dark" class="q-my-sm" v-model="date" stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-datetime :dark="dark" class="q-my-sm" v-model="date" float-label="Float Label" clearable suffix="SUF" prefix="PRE" />
        <q-datetime :dark="dark" class="q-my-sm" v-model="date" placeholder="Placeholder" float-label="With placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-datetime :dark="dark" class="q-my-sm" v-model="date" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-datetime :dark="dark" class="q-my-sm" color="amber-2" v-model="date" stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-datetime :dark="dark" class="q-my-sm" v-model="date" inverted stack-label="Stack Label" clearable />
        <q-datetime :dark="dark" class="q-my-sm" v-model="date" inverted stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-datetime :dark="dark" class="q-my-sm" v-model="date" inverted color="secondary" stack-label="With placeholder" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-datetime :dark="dark" class="q-my-sm" color="amber-2" v-model="date" inverted-light stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-datetime :dark="dark" class="q-my-sm" color="amber-2" v-model="date" inverted-light float-label="With placeholder" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-datetime :dark="dark" class="q-my-sm" color="white" v-model="date" inverted-light stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />

        <q-chips-input :dark="dark" class="q-my-sm" v-model="chips" stack-label="Stack Label" clearable />
        <q-chips-input :dark="dark" class="q-my-sm" v-model="chips" stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-chips-input :dark="dark" class="q-my-sm" v-model="chips" float-label="Float Label" clearable suffix="SUF" prefix="PRE" />
        <q-chips-input :dark="dark" class="q-my-sm" v-model="chips" placeholder="Placeholder" float-label="With placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-chips-input :dark="dark" class="q-my-sm" v-model="chips" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-chips-input :dark="dark" class="q-my-sm" color="amber-2" chips-color="amber-2" chips-bg-color="dark" v-model="chips" stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-chips-input :dark="dark" class="q-my-sm" v-model="chips" inverted stack-label="Stack Label" clearable />
        <q-chips-input :dark="dark" class="q-my-sm" v-model="chips" inverted stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-chips-input :dark="dark" class="q-my-sm" v-model="chips" inverted color="secondary" stack-label="With placeholder" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-chips-input :dark="dark" class="q-my-sm" color="amber-2" v-model="chips" inverted-light stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-chips-input :dark="dark" class="q-my-sm" color="amber-2" v-model="chips" inverted-light float-label="With placeholder" placeholder="Placeholder" clearable suffix="SUF" prefix="PRE" />
        <q-chips-input :dark="dark" class="q-my-sm" color="white" v-model="chips" inverted-light stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
        <q-chips-input :dark="dark" class="q-my-sm" inverted color="dark" chips-color="black" chips-bg-color="lime" v-model="chips" stack-label="Stack Label" clearable suffix="SUF" prefix="PRE" />
      </div>
      <q-toggle v-model="dark" label="Dark" class="fixed-top-left bg-grey-5 q-pa-sm" style="top: 18px; left: 18px;" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: '',

      dark: false,
      date: new Date(),
      chips: ['Jim', 'Joe']
    }
  }
}
</script>
