<template>
  <div class="row" style="padding: 1500px 0; width: 2000px">
    <div class="col" style="height:2000px; width:100px; background-color:red;">
      <q-context-menu>
        <q-list link separator style="min-width: 150px; max-height: 300px;">
          <q-item v-close-overlay>
            <q-item-main label="Test" />
          </q-item>
        </q-list>
      </q-context-menu>
    </div>

    <div class="col" style="margin-top: 500px; height:2000px; width:100px; background-color:red;">
      <q-context-menu>
        <q-list link separator style="min-width: 150px; max-height: 300px;">
          <q-item v-close-overlay>
            <q-item-main label="Test" />
          </q-item>
        </q-list>
      </q-context-menu>
    </div>

    <div class="col" style="margin-bottom: 500px; height:2000px; width:100px; background-color:red;">
      <q-context-menu>
        <q-list link separator style="min-width: 150px; max-height: 300px;">
          <q-item v-close-overlay>
            <q-item-main label="Test" />
          </q-item>
        </q-list>
      </q-context-menu>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="stylus">
@import '~quasar-variables'

</style>
