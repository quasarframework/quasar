<template>
  <div class="q-pa-md">
    <q-btn label="Open Menu" color="primary">
      <q-menu>
        <q-list>
          <q-item
            v-for="n in 5"
            :key="n"
            v-close-menu
            clickable
            @click="onClick(n)"
          >
            <q-item-section>Menu Item</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script>
export default {
  methods: {
    onClick (index) {
      this.$q.notify({
        message: `Clicked on menu item #${index + 1} and closed QMenu`,
        color: 'primary'
      })
    }
  }
}
</script>
