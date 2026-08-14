<template>
  <div class="q-pa-md">
    <div class="row no-wrap shadow-1">
      <q-toolbar
        class="col-8"
        :class="$q.dark.isActive ? 'bg-grey-9 text-white' : 'bg-grey-3'"
      >
        <q-btn aria-label="Toggle drawer" flat round dense icon="menu" />
        <q-toolbar-title>Title</q-toolbar-title>
        <q-btn aria-label="Search" flat round dense icon="search" />
      </q-toolbar>
      <q-toolbar class="col-4 bg-primary text-white">
        <q-space />
        <q-btn
          aria-label="Bluetooth"
          flat
          round
          dense
          icon="bluetooth"
          class="q-mr-sm"
        />
        <q-btn aria-label="More options" flat round dense icon="more_vert" />
      </q-toolbar>
    </div>
  </div>
</template>
