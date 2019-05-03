<template>
  <q-page padding>
    <h5 class="text-secondary">
      Page second
    </h5>
    <h3>Layout 1</h3>
    <q-btn-group>
      <q-btn color="primary" to="/meta/layout_1/first" label="first" />
      <q-btn color="secondary" to="/meta/layout_1/second" label="second" />
      <q-btn color="accent" to="/meta/layout_1/third" label="third" />
    </q-btn-group>
    <h3>Layout 2</h3>
    <q-btn-group>
      <q-btn color="primary" to="/meta/layout_2/first" label="first" />
      <q-btn color="secondary" to="/meta/layout_2/second" label="second" />
      <q-btn color="accent" to="/meta/layout_2/third" label="third" />
    </q-btn-group>

    <pre>{{ __qMeta }}</pre>
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageSecond',
  meta: {
    title: 'PAGE 2',
    meta: {
      description: { name: 'description', content: 'Page 2' }
    },
    link: {
      google: { rel: 'stylesheet', href: 'http://bogus.com/2' }
    },
    bodyAttr: {
      some: 'value'
    },
    htmlAttr: {
      'third-page': 'w'
    }
  }
}
</script>
