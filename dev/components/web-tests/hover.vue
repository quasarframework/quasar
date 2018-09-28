<template>
  <div class="layout-padding">
    <h1>Focus helper test</h1>
    <q-list>
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon color="primary" name="bluetooth" />
        </q-item-section>
        <q-item-section>List item</q-item-section>
      </q-item>
    </q-list>

    <q-list dark class="bg-black">
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon color="primary" name="bluetooth" />
        </q-item-section>
        <q-item-section>List item</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
