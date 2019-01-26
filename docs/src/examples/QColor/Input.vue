<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-input
        filled
        v-model="color"
        class="my-input"
      >
        <q-icon slot="append" name="colorize" class="cursor-pointer">
          <q-popup-proxy>
            <q-color v-model="color" />
          </q-popup-proxy>
        </q-icon>
      </q-input>

      <q-input
        filled
        v-model="secondColor"
        :rules="['anyColor']"
        hint="With validation"
        class="my-input"
      >
        <q-icon slot="append" name="colorize" class="cursor-pointer">
          <q-popup-proxy>
            <q-color v-model="secondColor" />
          </q-popup-proxy>
        </q-icon>
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

<style lang="stylus" scoped>
.my-input
  max-width 250px
</style>
