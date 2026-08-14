<template>
  <div class="q-pa-md q-gutter-y-sm">
    <q-toolbar class="text-primary">
      <q-btn aria-label="Toggle drawer" flat round dense icon="menu" />
      <q-toolbar-title> Toolbar </q-toolbar-title>
      <q-btn aria-label="More options" flat round dense icon="more_vert" />
    </q-toolbar>

    <q-toolbar class="bg-grey-9 text-white">
      <q-btn aria-label="Toggle drawer" flat round dense>
        <q-icon name="menu" />
      </q-btn>
      <q-toolbar-title> Toolbar </q-toolbar-title>
      <q-btn aria-label="More options" flat round dense>
        <q-icon name="more_vert" />
      </q-btn>
    </q-toolbar>

    <q-toolbar class="bg-purple text-white">
      <q-btn aria-label="Profile" flat round dense icon="assignment_ind" />
      <q-toolbar-title> Toolbar </q-toolbar-title>
      <q-btn aria-label="Apps" flat round dense icon="apps" class="q-mr-xs" />
      <q-btn aria-label="More options" flat round dense icon="more_vert" />
    </q-toolbar>

    <q-toolbar class="bg-black text-white">
      <q-btn aria-label="Profile" flat round dense icon="assignment_ind">
        <q-badge floating color="red">2</q-badge>
      </q-btn>
      <q-toolbar-title> Toolbar </q-toolbar-title>
      <q-btn
        aria-label="SIM settings"
        flat
        round
        dense
        icon="sim_card"
        class="q-mr-xs"
      />
      <q-btn aria-label="Games" flat round dense icon="gamepad" />
    </q-toolbar>
  </div>
</template>
