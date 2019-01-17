<template>
  <div class="q-pa-md">
    <div class="q-gutter-xs">
      <q-chip removable v-model="icecream" @remove="log('Icecream')" color="primary" text-color="white" icon="cake">
        Ice cream
      </q-chip>
      <q-chip removable v-model="eclair" @remove="log('Icecream')" color="teal" text-color="white" icon="cake">
        Eclair
      </q-chip>
      <q-chip removable v-model="cupcake" @remove="log('Icecream')" color="orange" text-color="white" icon="cake">
        Cupcake
      </q-chip>
      <q-chip disable removable v-model="gingerbread" @remove="log('Icecream')" color="red" text-color="white" icon="cake">
        Gingerbread (disable)
      </q-chip>
    </div>

    <q-btn color="primary" label="Reset" @click="reset" class="q-mt-sm" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      icecream: true,
      eclair: true,
      cupcake: true,
      gingerbread: true
    }
  },

  methods: {
    reset () {
      this.icecream = true
      this.eclair = true
      this.cupcake = true
      this.gingerbread = true
    },

    log (desert) {
      console.log(`${desert} has been removed`)
    }
  }
}
</script>
