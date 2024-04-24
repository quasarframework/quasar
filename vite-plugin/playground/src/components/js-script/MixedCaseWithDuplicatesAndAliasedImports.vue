<template>
  <h6>With Mixed Case and Duplicates and Aliased Imports</h6>

  <div>
    <q-btn label="Click me" />
    <QIcon name="map" />
    <q-icon name="home" />
  </div>
</template>

<script>
import { QIcon as Bibi } from 'quasar'
import { defineComponent } from 'vue'

console.log(Bibi)

export default defineComponent({
  name: 'RSMixedCaseWithDuplicatesAndAliasedImports'
})
</script>
