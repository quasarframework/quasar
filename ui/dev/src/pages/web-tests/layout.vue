<template>
  <div>
    <q-option-group
      class="q-mx-none"
      type="radio"
      v-model="tab"
      :options="[
        {label: 'one', value: 'one'},
        {label: 'two', value: 'two'},
        {label: 'three', value: 'three'},
        {label: 'four', value: 'four'},
        {label: 'five', value: 'five'},
        {label: 'six', value: 'six'},
        {label: 'Bogus', value: 'bogus'}
      ]"
    />

    <br><br>

    <q-tabs inverted align="center" v-model="tab" @update:model-value="onInput" @select="onSelect">
      <q-tab name="one" label="One" @select="onTabSelect" />
      <q-tab name="two" label="Two" @select="onTabSelect" />
      <q-tab name="three" label="Three" @select="onTabSelect" />
      <q-tab name="four" label="Four" @select="onTabSelect" />
      <q-tab name="five" label="Five" @select="onTabSelect" />
      <q-tab name="six" label="Six" @select="onTabSelect" />
    </q-tabs>
    <br>

    <q-tabs inverted @update:model-value="onInput" @select="onSelect">
      <q-tab name="one" label="One" @select="onTabSelect" />
      <q-tab name="two" label="Two" @select="onTabSelect" />
      <q-tab name="three" label="Three" @select="onTabSelect" />
      <q-tab name="four" label="Four" @select="onTabSelect" />
      <q-tab name="five" label="Five" @select="onTabSelect" />
      <q-tab name="six" label="Six" @select="onTabSelect" />
    </q-tabs>
    <br>

    <q-tabs color="secondary" inverted>
      <q-route-tab
        v-for="route in ['a', 'b', 'c']"
        :key="route"

        :name="route"
        :to="`/lay/${route}`"
        :label="`Route ${route}`"
        @select="onRouteTabSelect"
        replace
        icon="receipt"
      />
      <q-tab name="link" label="Link" icon="cloud" color="amber" />

      <q-tab-panel name="link">
        Link Tab
      </q-tab-panel>
    </q-tabs>

    <router-view />
  </div>
</template>

<script>
export default {
  data () {
    return {
      tab: ''
    }
  },
  methods: {
    onInput (val) {
      console.log('@update:model-value', val)
    },
    onSelect (val) {
      console.log('@select', val)
    },
    onTabSelect (val) {
      console.log('@tab-select', val)
    },
    onRouteTabSelect (val) {
      console.log('@routeTab-select', val)
    }
  }
}
</script>
