<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        Breadcrumbs are great for navigation.
        <br>
        If window is wide enough then labels are also displayed.
      </p>
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Home" icon="home" />
        <q-breadcrumbs-el label="Components" icon="widgets" />
        <q-breadcrumbs-el label="Breadcrumbs" icon="navigation" />
      </q-breadcrumbs>
      <br><br>
      <q-breadcrumbs icon-separator="chevron_right" active-color="secondary" color="light">
        <q-breadcrumbs-el label="Home" to="/" />
        <q-breadcrumbs-el label="Components" to="/components" />
        <q-breadcrumbs-el label="Breadcrumbs" to="/components/breadcrums" />
        <q-breadcrumbs-el label="Bogus" to="/components/breadcrums/bogus" />
      </q-breadcrumbs>
      <br><br>
      <q-breadcrumbs align="center">
        <q-icon name="trending_flat" slot="separator" slot-scope="props" />
        <q-breadcrumbs-el active>Home</q-breadcrumbs-el>
        <q-breadcrumbs-el>Components</q-breadcrumbs-el>
        <q-breadcrumbs-el>Breadcrumbs</q-breadcrumbs-el>
      </q-breadcrumbs>
      <br><br>
      <q-breadcrumbs align="justify" style="max-width: 700px">
        <q-icon name="arrow_forward" slot="separator" slot-scope="props" />
        <q-breadcrumbs-el>Home</q-breadcrumbs-el>
        <q-breadcrumbs-el>Components</q-breadcrumbs-el>
        <q-breadcrumbs-el>Breadcrumbs</q-breadcrumbs-el>
      </q-breadcrumbs>
    </div>
  </div>
</template>
