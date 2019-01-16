<template>
  <div class="q-layout-padding">
    <q-btn label="Menu">
      <q-menu>
        <q-list style="min-width: 400px">
          <q-item to="/" exact>
            <q-item-section>/ exact</q-item-section>
          </q-item>
          <q-item to="/web-tests" exact>
            <q-item-section>/web-tests exact </q-item-section>
          </q-item>
          <q-item to="/web-tests">
            <q-item-section>/web-tests</q-item-section>
          </q-item>
          <q-item to="/bogus">
            <q-item-section>bogus</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Click {{ $route.path }}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>

    <q-btn class="q-ml-md" label="Dialog" @click="alert = true" />

    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section>
          <q-list style="min-width: 400px">
            <q-item to="/" exact>
              <q-item-section>/ exact</q-item-section>
            </q-item>
            <q-item to="/web-tests" exact>
              <q-item-section>/web-tests exact </q-item-section>
            </q-item>
            <q-item to="/web-tests">
              <q-item-section>/web-tests</q-item-section>
            </q-item>
            <q-item to="/bogus">
              <q-item-section>bogus</q-item-section>
            </q-item>
            <q-item>
              <q-item-section>Click {{ $route.path }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-dialog />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      alert: false
    }
  },
  methods: {
  }
}
</script>
