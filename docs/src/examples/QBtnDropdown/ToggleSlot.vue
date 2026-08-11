<template>
  <div class="q-pa-md">
    <q-btn-dropdown split color="primary" label="Save" @click="onMainClick">
      <template v-slot:toggle>
        <q-tooltip>More save options</q-tooltip>
      </template>

      <q-list role="menu">
        <q-item clickable v-close-popup @click="onItemClick">
          <q-item-section>Save as...</q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="onItemClick">
          <q-item-section>Save a copy</q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script setup>
function onMainClick() {
  console.log('Clicked on main button')
}

function onItemClick() {
  console.log('Clicked on an Item')
}
</script>
