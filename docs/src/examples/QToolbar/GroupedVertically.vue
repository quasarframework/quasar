<template>
  <div class="q-pa-md q-gutter-y-sm">
    <div class="bg-orange text-white">
      <q-toolbar>
        <q-btn
          aria-label="Toggle drawer"
          flat
          round
          dense
          icon="menu"
          class="q-mr-sm"
        />
        <q-space />
        <q-btn
          aria-label="Search"
          flat
          round
          dense
          icon="search"
          class="q-mr-xs"
        />
        <q-btn aria-label="Add group" flat round dense icon="group_add" />
      </q-toolbar>
      <q-toolbar inset>
        <q-toolbar-title><strong>Quasar</strong> Framework</q-toolbar-title>
      </q-toolbar>
    </div>

    <div class="bg-cyan text-white">
      <q-toolbar>
        <q-btn aria-label="Profile" flat round dense icon="assignment_ind" />

        <q-space />

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

      <q-toolbar inset>
        <q-breadcrumbs active-color="white" style="font-size: 16px">
          <q-breadcrumbs-el label="Home" icon="home" />
          <q-breadcrumbs-el label="Components" icon="widgets" />
          <q-breadcrumbs-el label="Toolbar" />
        </q-breadcrumbs>
      </q-toolbar>
    </div>
  </div>
</template>
