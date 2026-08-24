<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-btn
        color="primary"
        @click="showing = true"
        label="Show"
        :disable="showing"
      />
      <q-btn
        color="primary"
        @click="showing = false"
        label="Hide"
        :disable="!showing"
      />
    </div>

    <div
      style="width: 200px; height: 70px"
      class="bg-purple text-white rounded-borders row flex-center q-mt-md cursor-pointer"
      role="button"
      tabindex="0"
      aria-haspopup="menu"
    >
      Click me

      <q-menu v-model="showing">
        <q-list role="menu" style="min-width: 100px">
          <q-item clickable v-close-popup>
            <q-item-section no-wrap>New tab</q-item-section>
          </q-item>
          <!-- #region -->
          <q-item clickable v-close-popup>
            <q-item-section no-wrap>New incognito tab</q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable v-close-popup>
            <q-item-section no-wrap>Recent tabs</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>History</q-item-section>
          </q-item>
          <!-- #endregion -->
        </q-list>
      </q-menu>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showing = ref(false)
</script>
