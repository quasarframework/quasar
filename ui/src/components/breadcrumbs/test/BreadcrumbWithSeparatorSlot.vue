<template>
  <q-breadcrumbs v-bind="$attrs">
    <q-breadcrumbs-el label="Home" icon="home" />
    <q-breadcrumbs-el label="Components" icon="widgets" />
    <q-breadcrumbs-el label="Toolbar" />

    <template v-slot:separator>
      <q-icon size="1.2em" name="arrow_forward" color="purple" />
    </template>
  </q-breadcrumbs>
</template>
