<template>
  <div class="q-pa-md">
    <div class="q-gutter-xs">
      <q-chip :selected.sync="desert.Icecream" color="primary" text-color="white" icon="cake">
        Ice cream
      </q-chip>
      <q-chip :selected.sync="desert.Eclair" color="teal" text-color="white" icon="cake">
        Eclair
      </q-chip>
      <q-chip :selected.sync="desert.Cupcake" color="orange" text-color="white" icon="cake">
        Cupcake
      </q-chip>
      <q-chip :selected.sync="desert.Gingerbread" color="red" text-color="white" icon="cake">
        Gingerbread
      </q-chip>
    </div>

    <div class="q-mt-sm">
      Your pick: {{ selection }}
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      desert: {
        Icecream: false,
        Eclair: true,
        Cupcake: false,
        Gingerbread: false
      }
    }
  },

  computed: {
    selection () {
      return Object.keys(this.desert)
        .filter(type => this.desert[type] === true)
        .join(', ')
    }
  }
}
</script>
