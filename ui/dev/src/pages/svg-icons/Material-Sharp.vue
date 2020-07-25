<template>
  <div>
    <div class="row justify-evenly items-center">
      <h4 class="no-margin">Material Icons Sharp</h4>
      Totals: {{ filteredCount }}/{{ iconCount }}
      <q-input borderless dense debounce="300" clearable v-model="filter" placeholder="Search">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <div class="row justify-center">
      <div
        v-for="(path, name) in icons"
        :key="name"
        class="row justify-center icon-box"
      >
        <q-icon :name="path" size="md" class="q-pa-xs column" />
        <span class="full-width text-center" style="font-size: 9px;">{{ name }}</span>
      </div>
      </div>
  </div>
</template>

<script>
import * as importedIcons from '@quasar/extras/material-icons-sharp'

export default {
  data () {
    return {
      importedIcons: Object.freeze(importedIcons),
      filter: ''
    }
  },
  computed: {
    icons () {
      const vals = {}
      const filter = this.filter ? this.filter.toLowerCase() : ''
      Object.keys(this.importedIcons).forEach(name => {
        if (filter === '' || name.toLowerCase().indexOf(filter) > -1) {
          vals[name] = this.importedIcons[name]
        }
      })
      return vals
    },
    filteredCount () {
      return Object.keys(this.icons).length
    },
    iconCount () {
      return Object.keys(this.importedIcons).length
    }
  }
}
</script>
