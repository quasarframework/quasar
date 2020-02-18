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
          <div class="text-h6">
            Alert
          </div>
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
          <q-btn flat no-caps label="ClosePopup" color="primary" v-close-popup />
          <q-btn flat no-caps label="Direct close" color="primary" @click="alert = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-btn class="q-ml-md" label="Dialog" @click="inject = true" />

    <q-dialog some="attribute" v-model="inject">
      <q-card>
        <q-card-section>
          <test-component />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  provide: {
    providedTest: 'Provide/Inject works!'
  },

  components: {
    TestComponent: {
      inject: {
        providedTest: {
          default: 'Provide/Inject DOES NOT WORKS'
        }
      },
      render (h) {
        return h('div', {
          staticClass: 'bg-white q-pa-xl'
        }, this.providedTest)
      }
    }
  },

  data () {
    return {
      alert: false,
      inject: false
    }
  },

  methods: {
  }
}
</script>
