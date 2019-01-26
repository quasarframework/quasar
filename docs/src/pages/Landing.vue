<template lang="pug">
q-page(padding)
  div.flex
    div.row
      h4 Quasar - Empowering your websites and apps
      div.row.col-12
        img(src='https://cdn.quasar-framework.org/img/responsive-logo.png')

      div.col-12.q-pt-sm Todo... Meanwhile, go to <doc-link to="/docs">Documentation pages</doc-link>.

      div.col-12.q-pt-md If you encounter a problem you can’t solve, you can also get help from:
        li the Quasar <doc-link to="https://forum.quasar-framework.org/">forum</doc-link>.
        li the <doc-link to="https://discord.gg/5TDhbDg">Discord chat server</doc-link>.
        li You can also get updates on new versions and features by following us on <doc-link to="https://twitter.com/quasarframework">Twitter</doc-link>.
</template>

<script>
export default {
  name: 'Landing',

  meta: {
    title: 'Quasar Framework'
  }
}
</script>
