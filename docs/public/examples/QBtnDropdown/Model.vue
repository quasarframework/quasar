<template>
  <div class="q-pa-md">
    <q-toggle v-model="menu" label="Menu state" />

    <q-btn-dropdown
      v-model="menu"
      class="glossy q-ml-lg"
      color="primary"
      label="Dropdown"
    >
      <q-list>
        <q-item clickable v-close-popup @click="onItemClick">
          <q-item-section avatar>
            <q-avatar icon="folder" color="primary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Photos</q-item-label>
            <q-item-label caption>February 22, 2016</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="onItemClick">
          <q-item-section avatar>
            <q-avatar icon="assignment" color="secondary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Vacation</q-item-label>
            <q-item-label caption>February 22, 2016</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      menu: ref(false),
      onItemClick () {
        // console.log('Clicked on an Item')
      }
    }
  }
}
</script>
