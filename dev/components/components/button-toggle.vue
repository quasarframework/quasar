<template>
  <div class="layout-padding button-group-test">
    <q-toggle v-model="toggled" />
    <br><br>

    <q-btn-toggle
      v-model="toggled"
      toggle-color="primary"
    >
      Toggle me
    </q-btn-toggle>

    <q-btn-toggle
      v-model="toggled"
      color="green"
      toggle-color="red"
    >
      Toggle me
    </q-btn-toggle>

    <q-btn-toggle
      v-model="toggled"
      color="green"
      toggle-color="red"
      push
    >
      Toggle me
    </q-btn-toggle>

    <div style="margin-top: 25px">
      <q-btn-toggle
        dense
        v-model="toggled"
        toggle-color="primary"
      >
        Toggle me
      </q-btn-toggle>

      <q-btn-toggle
        dense
        v-model="toggled"
        color="green"
        toggle-color="red"
      >
        Toggle me
      </q-btn-toggle>

      <q-btn-toggle
        dense
        v-model="toggled"
        color="green"
        toggle-color="red"
        push
      >
        Toggle me
      </q-btn-toggle>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      toggled: false
    }
  }
}
</script>

<style lang="stylus">
.button-toggle-test
  .q-btn-toggle
    margin 5px 15px
</style>
