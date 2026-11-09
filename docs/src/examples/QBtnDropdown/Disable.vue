<template>
  <div class="q-pa-md">
    <q-btn
      flat
      class="q-mb-sm"
      label="Disable first dropdown in 2 seconds"
      @click="scheduleDisable"
    />
    <div class="row q-gutter-sm">
      <q-btn-dropdown
        :disable="disabled"
        class="glossy"
        color="primary"
        label="Default"
        aria-haspopup="menu"
      >
        <q-list role="menu">
          <q-item clickable v-close-popup>
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
        </q-list>
      </q-btn-dropdown>

      <q-btn-dropdown
        split
        disable-main-btn
        class="glossy"
        color="primary"
        label="Only main btn"
        toggle-aria-haspopup="menu"
      >
        <q-list role="menu">
          <q-item clickable v-close-popup>
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

          <q-item clickable v-close-popup>
            <q-item-section avatar>
              <q-avatar
                icon="assignment"
                color="secondary"
                text-color="white"
              />
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

      <q-btn-dropdown
        split
        disable-dropdown
        class="glossy"
        color="primary"
        label="Only dropdown"
        toggle-aria-haspopup="menu"
      >
        <q-list role="menu">
          <q-item clickable v-close-popup>
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
        </q-list>
      </q-btn-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const disabled = ref(false)

function scheduleDisable() {
  setTimeout(() => {
    disabled.value = true
  }, 2000)
}
</script>
