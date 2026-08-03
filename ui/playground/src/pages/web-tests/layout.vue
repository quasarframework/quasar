<template>
  <div>
    <q-option-group
      class="q-mx-none"
      type="radio"
      v-model="tab"
      :options="[
        { label: 'one', value: 'one' },
        { label: 'two', value: 'two' },
        { label: 'three', value: 'three' },
        { label: 'four', value: 'four' },
        { label: 'five', value: 'five' },
        { label: 'six', value: 'six' },
        { label: 'Bogus', value: 'bogus' }
      ]"
    />

    <br /><br />

    <q-tabs align="center" v-model="tab" @update:model-value="onInput">
      <q-tab name="one" label="One" @click="onTabClick('one')" />
      <q-tab name="two" label="Two" @click="onTabClick('two')" />
      <q-tab name="three" label="Three" @click="onTabClick('three')" />
      <q-tab name="four" label="Four" @click="onTabClick('four')" />
      <q-tab name="five" label="Five" @click="onTabClick('five')" />
      <q-tab name="six" label="Six" @click="onTabClick('six')" />
    </q-tabs>
    <br />

    <q-tabs @update:model-value="onInput">
      <q-tab name="one" label="One" @click="onTabClick('one')" />
      <q-tab name="two" label="Two" @click="onTabClick('two')" />
      <q-tab name="three" label="Three" @click="onTabClick('three')" />
      <q-tab name="four" label="Four" @click="onTabClick('four')" />
      <q-tab name="five" label="Five" @click="onTabClick('five')" />
      <q-tab name="six" label="Six" @click="onTabClick('six')" />
    </q-tabs>
    <br />

    <q-tabs active-color="secondary">
      <q-route-tab
        v-for="route in ['a', 'b', 'c']"
        :key="route"
        :name="route"
        :to="`/lay/${route}`"
        :label="`Route ${route}`"
        @click="onRouteTabClick(route)"
        replace
        icon="receipt"
      />
      <q-tab name="link" label="Link" icon="cloud" />
    </q-tabs>

    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      tab: ''
    }
  },
  methods: {
    onInput(val) {
      console.log('@update:model-value', val)
    },
    onTabClick(val) {
      console.log('tab click', val)
    },
    onRouteTabClick(val) {
      console.log('route tab click', val)
    }
  }
}
</script>
