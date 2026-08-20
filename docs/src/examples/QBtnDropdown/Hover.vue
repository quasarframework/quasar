<template>
  <div class="q-pa-md q-gutter-md">
    <q-btn-dropdown color="primary" label="Hover me" hover aria-haspopup="menu">
      <q-list role="menu">
        <q-item clickable v-close-popup>
          <q-item-section>
            <q-item-label>Photos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup>
          <q-item-section>
            <q-item-label>Videos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup>
          <q-item-section>
            <q-item-label>Articles</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <q-btn-dropdown
      color="secondary"
      label="Split hover"
      split
      hover
      aria-haspopup="menu"
      @click="onMainClick"
    >
      <q-list role="menu">
        <q-item clickable v-close-popup>
          <q-item-section>
            <q-item-label>Photos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup>
          <q-item-section>
            <q-item-label>Videos</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script setup>
function onMainClick() {
  console.log('Clicked on main button')
}
</script>
