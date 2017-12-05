<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        Breadcrumbs are great for navigation.
        <br>
        If window is wide enough then labels are also displayed.
      </p>
      <q-breadcrumbs>
        <q-breadcrumb-el label="Home" icon="home" />
        <q-breadcrumb-el label="Components" icon="widgets" />
        <q-breadcrumb-el label="Breadcrumbs" icon="navigation" />
      </q-breadcrumbs>
      <br><br>
      <q-breadcrumbs icon-separator="chevron_right" active-color="secondary" color="light">
        <q-breadcrumb-el label="Home" to="/" />
        <q-breadcrumb-el label="Components" to="/components" />
        <q-breadcrumb-el label="Breadcrumbs" to="/components/breadcrums" />
        <q-breadcrumb-el label="Bogus" to="/components/breadcrums/bogus" />
      </q-breadcrumbs>
      <br><br>
      <q-breadcrumbs align="center">
        <q-icon name="trending_flat" slot="separator" />
        <q-breadcrumb-el active>Home</q-breadcrumb-el>
        <q-breadcrumb-el>Components</q-breadcrumb-el>
        <q-breadcrumb-el>Breadcrumbs</q-breadcrumb-el>
      </q-breadcrumbs>
      <br><br>
      <q-breadcrumbs align="justify" style="max-width: 700px">
        <q-icon name="arrow_forward" slot="separator" />
        <q-breadcrumb-el>Home</q-breadcrumb-el>
        <q-breadcrumb-el>Components</q-breadcrumb-el>
        <q-breadcrumb-el>Breadcrumbs</q-breadcrumb-el>
      </q-breadcrumbs>
    </div>
  </div>
</template>
