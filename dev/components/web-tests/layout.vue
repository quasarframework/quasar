<template>
  <div>
    <q-tabs class="secondary" inverted>
      <q-route-tab
        v-for="route in ['a', 'b', 'c']"
        :key="route"
        slot="title"
        :name="route"
        :to="`/lay/${route}`"
        :label="`Route ${route}`"
        icon="receipt"
      />
      <q-tab slot="title" name="link" label="Link" icon="cloud" />

      <q-tab-pane name="link">
        Link Tab
      </q-tab-pane>
    </q-tabs>

    <router-view />
  </div>
</template>
