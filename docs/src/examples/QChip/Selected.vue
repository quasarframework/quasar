<template>
  <div class="q-pa-md">
    <div class="q-gutter-xs">
      <q-chip v-model:selected="desert.Icecream" color="primary" text-color="white" icon="cake">
        Ice cream
      </q-chip>
      <q-chip v-model:selected="desert.Eclair" color="teal" text-color="white" icon="cake">
        Eclair
      </q-chip>
      <q-chip v-model:selected="desert.Cupcake" color="orange" text-color="white" icon="cake">
        Cupcake
      </q-chip>
      <q-chip v-model:selected="desert.Gingerbread" color="red" text-color="white" icon="cake">
        Gingerbread
      </q-chip>
    </div>

    <div class="q-mt-sm">
      Your pick: {{ selection }}
    </div>
  </div>
</template>

<script>
import { reactive, computed } from 'vue'

export default {
  setup () {
    const desert = reactive({
      Icecream: false,
      Eclair: true,
      Cupcake: false,
      Gingerbread: false
    })

    return {
      desert,
      selection: computed(() => {
        return Object.keys(desert)
          .filter(type => desert[ type ] === true)
          .join(', ')
      })
    }
  }
}
</script>
