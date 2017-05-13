<template>
  <div>
    <q-tabs color="secondary" inverted>
      <q-route-tab
        v-for="route in ['a', 'b', 'c']"
        :key="route"
        slot="title"
        :name="route"
        :to="`/lay/${route}`"
        :label="`Route ${route}`"
        replace
        icon="receipt"
      />
      <q-tab slot="title" name="link" label="Link" icon="cloud" color="amber" />

      <q-tab-pane name="link">
        Link Tab
      </q-tab-pane>
    </q-tabs>

    <router-view />
  </div>
</template>
