<template>
  <h1>{{ msg }}</h1>

  <q-icon name="local_fire_department" size="52px" color="red" class="q-mr-md" />
  <q-btn color="primary" icon="local_fire_department" label="Quasar!" @click="onClick" />

  <div v-ripple style="width: 500px; height: 500px" class="relative-position bg-amber" />
  <q-icon name="local_fire_department" size="52px" class="q-mr-md my-color" />

  <div class="my-div">&nbsp;</div>
</template>

<script>
import { useQuasar } from 'quasar'

export default {
  props: {
    msg: String
  },

  setup () {
    const $q = useQuasar()

    function onClick () {
      console.log('wee')
      $q.notify({
        message: 'Running Quasar on Vite'
      })
    }

    return {
      onClick
    }
  }
}
</script>

<style lang="sass">
.my-color
  color: $primary
.my-div
  background-color: $primary
  width: 150px
  height: 100px
</style>
