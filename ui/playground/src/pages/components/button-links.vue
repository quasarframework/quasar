<template>
  <div class="q-layout-padding column q-gutter-y-md">
    <q-toggle v-model="disable" label="Disabled" />

    <div class="row items-center q-gutter-md">
      <q-btn color="primary" :disable="disable" label="Router link - no type" replace :to="{ name: $route.name, query: { s: '1' } }" />
      <q-btn color="primary" :disable="disable" label="Router link - a" replace :to="{ name: $route.name, query: { s: '2' } }" type="a" />
      <q-btn color="primary" :disable="disable" label="Router link - button" replace :to="{ name: $route.name, query: { s: '3' } }" type="button" />
      <q-btn color="primary" :disable="disable" label="Router link - submit" replace :to="{ name: $route.name, query: { s: '4' } }" type="submit" />
      <q-btn color="primary" :disable="disable" label="Router link - reset" replace :to="{ name: $route.name, query: { s: '5' } }" type="reset" />
      <q-btn color="primary" :disable="disable" label="Router link - media type" replace :to="{ name: $route.name, query: { s: '6' } }" type="text/html" />
      <router-link :disable="disable" replace :to="{ name: $route.name, query: { s: '7' } }">Router link</router-link>
    </div>

    <div class="row items-center q-gutter-md">
      <q-btn color="primary" :disable="disable" label="Href - no type" target="_blank" href="https://www.google.com" />
      <q-btn color="primary" :disable="disable" label="Href - a" target="_blank" href="https://www.google.com" type="a" />
      <q-btn color="primary" :disable="disable" label="Href - button" target="_blank" href="https://www.google.com" type="button" />
      <q-btn color="primary" :disable="disable" label="Href - submit" target="_blank" href="https://www.google.com" type="submit" />
      <q-btn color="primary" :disable="disable" label="Href - reset" target="_blank" href="https://www.google.com" type="reset" />
      <q-btn color="primary" :disable="disable" label="Href - media type" target="_blank" href="https://www.google.com" type="text/html" />
    </div>

    <div class="row items-center q-gutter-md">
      <q-btn color="primary" :disable="disable" label="Button - no type" />
      <q-btn color="primary" :disable="disable" label="Button - a" type="a" />
      <q-btn color="primary" :disable="disable" label="Button - button" type="button" />
      <q-btn color="primary" :disable="disable" label="Button - submit" type="submit" />
      <q-btn color="primary" :disable="disable" label="Button - reset" type="reset" />
      <q-btn color="primary" :disable="disable" label="Button - wrong type" type="wrong" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      disable: false
    }
  }
}
</script>
