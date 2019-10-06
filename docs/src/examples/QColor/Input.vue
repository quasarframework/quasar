<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-input
        filled
        v-model="color"
        class="my-input"
      >
        <template v-slot:append>
          <q-icon name="colorize" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-color v-model="color" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <q-input
        filled
        v-model="secondColor"
        :rules="['anyColor']"
        hint="With validation"
        class="my-input"
      >
        <template v-slot:append>
          <q-icon name="colorize" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-color v-model="secondColor" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      color: '#FF00FF',
      secondColor: '#027be3'
    }
  }
}
</script>

<style lang="sass" scoped>
.my-input
  max-width: 250px
</style>
