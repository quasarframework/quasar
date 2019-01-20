<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">
      <q-input filled v-model="color">
        <q-icon slot="append" name="colorize" class="cursor-pointer">
          <q-popup-proxy>
            <q-color
              v-model="color"
            />
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
      color: '#FF00FF'
    }
  }
}
</script>
