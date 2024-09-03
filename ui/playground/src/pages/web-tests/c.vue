<template>
  <div class="q-layout-padding">
    <q-toggle v-model="gigi" label="Gigi" />
    <q-btn color="purple" label="Account Settings - menu with attrs">
      <q-menu a="1">
        <div class="row no-wrap q-pa-md">
          <div class="column">
            <div class="text-h6 q-mb-md">
              Settings
            </div>
            <q-toggle v-model="mobileData" label="Use Mobile Data" @click="log" />
            <q-toggle v-model="bluetooth" label="Bluetooth" />
          </div>

          <q-separator vertical inset class="q-mx-lg" />

          <div class="column items-center">
            <q-avatar size="72px">
              <img src="https://cdn.quasar.dev/img/avatar4.jpg">
            </q-avatar>

            <div class="text-subtitle1 q-mt-md q-mb-xs">
              John Doe
            </div>

            <q-btn
              color="primary"
              label="Logout"
              push
              size="sm"
              v-close-popup
            />
          </div>
        </div>
      </q-menu>
    </q-btn>
    <q-btn color="purple" label="Account Settings - menu without attrs" class="on-right">
      <q-menu>
        <div class="row no-wrap q-pa-md">
          <div class="column">
            <div class="text-h6 q-mb-md">
              Settings
            </div>
            <q-toggle v-model="mobileData" label="Use Mobile Data" @click="log" />
            <q-toggle v-model="bluetooth" label="Bluetooth" />
          </div>

          <q-separator vertical inset class="q-mx-lg" />

          <div class="column items-center">
            <q-avatar size="72px">
              <img src="https://cdn.quasar.dev/img/avatar4.jpg">
            </q-avatar>

            <div class="text-subtitle1 q-mt-md q-mb-xs">
              John Doe
            </div>

            <q-btn
              color="primary"
              label="Logout"
              push
              size="sm"
              v-close-popup
            />
          </div>
        </div>
      </q-menu>
    </q-btn>
  </div>
</template>

<script>
export default {
  data () {
    return {
      gigi: false,
      mobileData: false,
      bluetooth: true
    }
  },

  methods: {
    log (e) {
      console.log('@click', e)
    }
  }
}
</script>
