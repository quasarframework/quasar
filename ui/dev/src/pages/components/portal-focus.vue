<template>
  <div class="q-pa-md">
    <div class="q-mb-md">Should focus on the dialog input after showing</div>

    <q-btn label="DIALOG" color="primary" @click="icon = true" />

    <q-btn color="primary" label="MENU" class="q-ml-md">
      <q-menu>
        <q-list dense style="min-width: 100px">
          <q-item clickable v-close-popup @click="icon = true">
            <q-item-section>DIALOG</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>

    <q-dialog v-model="icon" persistent transition-show="scale" transition-hide="scale">
      <q-card>
        <q-toolbar>
          <q-toolbar-title class="text-weight-bold">FORM</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          <q-input outlined dense autofocus />
          <q-btn color="primary" label="OK" class="q-mt-md" v-close-popup />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      icon: false,
      bar: false,
      bar2: false,
      toolbar: false
    }
  }
}
</script>
