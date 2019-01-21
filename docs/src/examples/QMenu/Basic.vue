<template>
  <div
        style="height: 300px; margin-top: 40px;"
        class="bg-secondary text-white row flex-center"
      >
        Target area
      <q-menu touchPosition context-menu>
        <q-list link separator style="min-width: 150px; max-height: 300px;">
          <q-item v-close-menu @click.native="showNotif('Value 1')">
            <q-item-label>Value 1</q-item-label>
          </q-item>
          <q-item v-close-menu @click.native="showNotif('Value 2')">
            <q-item-label>Value 2</q-item-label>
          </q-item>
        </q-list>
    </q-menu>
  </div>
</template>

<script>
export default {
  methods: {
    showNotif (value) {
      this.$q.notify({
        message: value
      })
    }
  }
}
</script>
