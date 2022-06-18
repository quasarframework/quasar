<template>
  <div>
    <div class="q-layout-padding">
      <p class="caption">
        Breadcrumbs are great for navigation.
        <br>
        If window is wide enough then labels are also displayed.
      </p>
      <div class="q-gutter-sm">
        <q-toggle v-model="first" label="first" />
        <q-toggle v-model="second" label="second" />
        <q-toggle v-model="third" label="third" />
      </div>
      <br><br>
      <q-breadcrumbs class="text-teal">
        <q-breadcrumbs-el v-if="first" label="Home" icon="home" />
        <q-breadcrumbs-el v-if="second" label="Components" icon="widgets" />
        <q-breadcrumbs-el v-if="third" label="Breadcrumbs" icon="navigation" />
      </q-breadcrumbs>

      <br><br>
      <q-breadcrumbs separator-color="deep-orange" style="font-size: 24px">
        <q-breadcrumbs-el label="Home" icon="home" />
        <q-breadcrumbs-el label="Home" />
        <q-breadcrumbs-el label="Home" />
        <q-breadcrumbs-el label="Home" />
      </q-breadcrumbs>
      <br><br>
      <q-breadcrumbs active-color="secondary" class="text-orange" align="right">
        <q-breadcrumbs-el label="Router; Home Disabled" disable to="/" />
        <q-breadcrumbs-el label="Router; Home" to="/" />
        <q-breadcrumbs-el label="Router; Components" to="/components" />
        <q-breadcrumbs-el label="Router; Breadcrumbs" to="/components/breadcrumbs" active-class="special-breadcrumbs-class" />
        <q-breadcrumbs-el label="Router; Bogus" to="/components/breadcrumbs/bogus" />
      </q-breadcrumbs>
      <br><br>
      <q-breadcrumbs active-color="secondary" class="text-orange" align="right">
        <q-breadcrumbs-el label="href; Home Disabled" disable href="/" />
        <q-breadcrumbs-el label="href; Home + _blank" href="/" target="_blank" />
        <q-breadcrumbs-el label="href; Components" href="/components" />
        <q-breadcrumbs-el label="href; Breadcrumbs" href="/components/breadcrumbs" />
        <q-breadcrumbs-el label="href; Bogus" href="/components/breadcrumbs/bogus" />
      </q-breadcrumbs>
      <br><br>
      <q-breadcrumbs align="center">
        <template v-slot:separator>
          <q-icon name="trending_flat" />
        </template>
        <q-breadcrumbs-el>Home</q-breadcrumbs-el>
        <q-breadcrumbs-el>Components</q-breadcrumbs-el>
        <q-breadcrumbs-el>Breadcrumbs</q-breadcrumbs-el>
      </q-breadcrumbs>
      <br><br>
      <q-breadcrumbs align="around" style="max-width: 700px" class="q-mx-auto">
        <template v-slot:separator>
          <q-icon name="arrow_forward" />
        </template>
        <q-breadcrumbs-el>Home</q-breadcrumbs-el>
        <q-breadcrumbs-el>Components</q-breadcrumbs-el>
        <q-breadcrumbs-el>Breadcrumbs</q-breadcrumbs-el>
      </q-breadcrumbs>
      <br><br>
      <q-breadcrumbs align="between" style="max-width: 700px" class="q-mx-auto">
        <template v-slot:separator>
          <q-icon name="arrow_forward" />
        </template>
        <q-breadcrumbs-el>Home</q-breadcrumbs-el>
        <q-breadcrumbs-el>Components</q-breadcrumbs-el>
        <q-breadcrumbs-el>Breadcrumbs</q-breadcrumbs-el>
      </q-breadcrumbs>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      first: true,
      second: true,
      third: true
    }
  }
}
</script>

<style lang="sass">
.special-breadcrumbs-class
  color: green !important
</style>
