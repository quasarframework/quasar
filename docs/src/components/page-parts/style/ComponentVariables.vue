<template lang="pug">
q-card(v-if="ready", flat, bordered)
  q-markup-table
    thead
      tr
        th Variable
        th Affects
    tbody
      tr(v-for="(def, variable) in variables" v-if="def.references || def.affects")
        td ${{ variable }}
        td
          .row.q-gutter-md(v-if="def.references")
            q-badge(v-for="(ref, comp) in def.references" :key="comp")
              div {{ comp }}
              q-tooltip {{ ref.desc }}
          .row.q-gutter-md(v-if="def.affects")
            q-badge(v-for="affect in def.affects" :key="affect.selector" color="accent")
              div {{ affect.selector }}
              q-tooltip {{ affect.property }}
</template>

<script>

export default {
  name: 'ComponentVariables',

  data () {
    return {
      ready: false,
      variables: null
    }
  },

  mounted () {
    import(`quasar/dist/variables.json`).then(file => {
      this.variables = file.default
      this.ready = true
    })
  }
}
</script>
