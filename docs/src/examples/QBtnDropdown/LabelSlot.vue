<template>
  <div class="q-pa-md">
    <q-btn-dropdown
      split
      color="cyan"
      push
      no-caps
      @click="onMainClick"
    >
      <template v-slot:label>
        <div class="row items-center no-wrap">
          <q-icon left name="map" />
          <div class="text-center">
            Custom<br>Content
          </div>
        </div>
      </template>

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
export default {
  setup () {
    return {
      onMainClick () {
        // console.log('Clicked on main button')
      },

      onItemClick () {
        // console.log('Clicked on an Item')
      }
    }
  }
}
</script>
