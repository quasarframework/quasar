<template>
  <div class="q-pa-md">
    <div class="q-gutter-md column" style="max-width: 300px">
      <q-toolbar class="bg-primary text-white rounded-borders">
        <q-btn round dense flat icon="menu" />
        <q-avatar class="q-ml-xs">
          <img src="https://cdn.quasar-framework.org/img/quasar-logo.png">
        </q-avatar>

        <q-input dark class="col" borderless v-model="text" input-class="text-right">
          <q-icon slot="append" v-if="text === ''" color="white" name="search" />
          <q-icon slot="append" v-else color="white" name="clear" class="cursor-pointer" @click="text = ''" />
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
