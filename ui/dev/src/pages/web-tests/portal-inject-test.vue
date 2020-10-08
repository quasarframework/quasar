<template>
  <div class="q-layout-padding">
    <q-btn label="Menu">
      <q-menu>
        <q-list>
          <q-item to="/" exact>
            <q-item-section>/ exact</q-item-section>
          </q-item>
          <q-item to="/web-tests" exact>
            <q-item-section>/web-tests exact </q-item-section>
          </q-item>
          <q-item to="/web-tests/portal-inject-test">
            <q-item-section>/web-tests/portal-inject-test</q-item-section>
          </q-item>
          <q-item to="/bogus">
            <q-item-section>bogus</q-item-section>
          </q-item>
          <q-separator />
          <q-item>
            <q-item-section>$route.path: {{ $route.path }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <test-component />
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>

    <q-btn class="q-ml-md" label="Dialog" @click="alert = true" />

    <q-dialog some="attribute" v-model="alert">
      <q-card>
        <q-card-section class="text-h6">
          Alert
        </q-card-section>

        <q-separator />

        <q-list>
          <q-item to="/" exact>
            <q-item-section>/ exact</q-item-section>
          </q-item>
          <q-item to="/web-tests" exact>
            <q-item-section>/web-tests exact </q-item-section>
          </q-item>
          <q-item to="/web-tests/portal-inject-test">
            <q-item-section>/web-tests/portal-inject-test</q-item-section>
          </q-item>
          <q-item to="/bogus">
            <q-item-section>bogus</q-item-section>
          </q-item>
          <q-separator />
          <q-item>
            <q-item-section>$route.path: {{ $route.path }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <test-component />
            </q-item-section>
          </q-item>
        </q-list>

        <q-separator />

        <q-card-actions>
          <q-btn label="Menu" color="primary">
            <q-menu>
              <q-list class="bg-primary text-white">
                <q-item to="/" exact>
                  <q-item-section>/ exact</q-item-section>
                </q-item>
                <q-item to="/web-tests" exact>
                  <q-item-section>/web-tests exact </q-item-section>
                </q-item>
                <q-item to="/web-tests/portal-inject-test" active-class="text-white text-weight-bold">
                  <q-item-section>/web-tests/portal-inject-test</q-item-section>
                </q-item>
                <q-item to="/bogus">
                  <q-item-section>bogus</q-item-section>
                </q-item>
                <q-separator />
                <q-item>
                  <q-item-section>$route.path: {{ $route.path }}</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <test-component />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <q-space />

          <q-btn flat no-caps label="ClosePopup" color="primary" v-close-popup />
          <q-btn flat no-caps label="Direct close" color="primary" @click="alert = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { h, defineComponent } from 'vue'

const TestComponent = defineComponent({
  inject: {
    providedTest: {
      default: 'Provide/Inject DOES NOT WORKS'
    }
  },

  render () {
    return h('div', { class: 'text-weight-bold' }, this.providedTest)
  }
})

export default {
  provide: {
    providedTest: 'Provide/Inject works!'
  },

  components: {
    TestComponent
  },

  data () {
    return {
      alert: false
    }
  }
}
</script>
