<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-between">

      <q-btn color="primary" label="Account Settings">
        <q-menu
        >
          <div class="row no-wrap q-pa-md">
            <div class="column">
              <div class="text-h6 q-mb-md">Settings</div>
              <q-toggle v-model="mobileData" label="Use Mobile Data" />
              <q-toggle v-model="bluetooth" label="Bluetooth" />
            </div>

            <q-separator vertical inset class="q-mx-lg" />

            <div class="column items-center">
              <q-avatar size="72px">
                <img src="https://cdn.quasar-framework.org/img/boy-avatar.png">
              </q-avatar>

              <div class="text-subtitle1 q-mt-md q-mb-xs">John Doe</div>

              <q-btn
                color="primary"
                label="Logout"
                push
                size="sm"
                v-close-menu
              />
            </div>
          </div>
        </q-menu>
      </q-btn>

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      mobileData: true,
      bluetooth: false
    }
  }
}
</script>
