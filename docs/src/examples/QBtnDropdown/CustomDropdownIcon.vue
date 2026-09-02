<template>
  <div class="q-pa-md">
    <q-btn-dropdown
      color="pink"
      label="Dropdown Button"
      dropdown-icon="change_history"
      aria-haspopup="menu"
    >
      <q-list role="menu">
        <q-item v-close-popup @click="onItemClick">
          <q-item-section>
            <q-item-label>Photos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-close-popup @click="onItemClick">
          <q-item-section>
            <q-item-label>Videos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-close-popup @click="onItemClick">
          <q-item-section>
            <q-item-label>Articles</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script setup>
function onItemClick() {
  console.log('Clicked on an Item')
}
</script>
