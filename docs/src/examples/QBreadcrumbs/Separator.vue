<template>
  <div class="q-pa-md q-gutter-sm">
    <q-breadcrumbs separator="---" class="text-orange" active-color="secondary">
      <q-breadcrumbs-el icon="home" />
      <q-breadcrumbs-el label="Components" icon="widgets" />
      <q-breadcrumbs-el label="Breadcrumbs" icon="navigation" />
    </q-breadcrumbs>

    <q-breadcrumbs class="text-grey" active-color="purple">
      <q-icon
        v-slot:separator
        size="1.2em"
        name="arrow_forward"
        color="purple"
      />

      <q-breadcrumbs-el label="Home" icon="home" />
      <q-breadcrumbs-el label="Components" icon="widgets" />
      <q-breadcrumbs-el label="Breadcrumbs" icon="navigation" />
    </q-breadcrumbs>

    <q-breadcrumbs class="text-brown">
      <q-icon
        v-slot:separator
        size="1.5em"
        name="chevron_right"
        color="primary"
      />

      <q-breadcrumbs-el label="Home" icon="home" />
      <q-breadcrumbs-el label="Components" icon="widgets" />
      <q-breadcrumbs-el label="Breadcrumbs" icon="navigation" />
    </q-breadcrumbs>
  </div>
</template>
