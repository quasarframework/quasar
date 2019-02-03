<template>
  <div class="q-pa-md">
    <div class="q-gutter-md column" style="width: 300px; max-width: 100%">
      <q-toolbar class="bg-primary text-white rounded-borders">
        <q-btn round dense flat icon="menu" class="q-mr-xs" />
        <q-avatar class="gt-xs">
          <img src="https://cdn.quasar-framework.org/img/quasar-logo.png">
        </q-avatar>

        <q-space />
        <q-input dark borderless v-model="text" input-class="text-right">
          <q-icon slot="append" v-if="text === ''" name="search" />
          <q-icon slot="append" v-else name="clear" class="cursor-pointer" @click="text = ''" />
        </q-input>
      </q-toolbar>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: ''
    }
  }
}
</script>
