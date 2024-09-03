<template>
  <div class="row" style="padding: 1500px 0; width: 2000px">
    <div class="col" style="height:2000px; width:100px; background-color:red;">
      <q-menu context-menu>
        <q-list link separator style="min-width: 150px; max-height: 300px;">
          <q-item v-close-popup>
            <q-item-section>Test</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </div>

    <div class="col" style="margin-top: 500px; height:2000px; width:100px; background-color:red;">
      <q-menu context-menu>
        <q-list link separator style="min-width: 150px; max-height: 300px;">
          <q-item v-close-popup>
            <q-item-section>Test</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </div>

    <div class="col" style="margin-bottom: 500px; height:2000px; width:100px; background-color:red;">
      <q-menu context-menu>
        <q-list link separator style="min-width: 150px; max-height: 300px;">
          <q-item v-close-popup>
            <q-item-section>Test</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
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
