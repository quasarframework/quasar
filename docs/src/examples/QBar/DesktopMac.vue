<template>
  <div class="q-pa-md q-gutter-sm" ref="wrapper">
    <q-resize-observer @resize="resize" />
    <p>Maximized</p>
    <q-bar class="q-ml-md my-bar" >
      <q-btn dense flat icon="fab fa-apple" />
      <div><strong>My-App</strong></div>
      <div>File</div>
      <div>Edit</div>
      <div>View</div>
      <div>Window</div>
      <div>Help</div>
      <q-space />
      <template v-if="small">
        <q-btn dense flat icon="more_vert" />
      </template>
      <template v-else>
        <q-btn dense flat icon="airplay" />
        <q-btn dense flat icon="battery_charging_full" />
        <q-btn dense flat icon="wifi" />
        <div>Mon 9:41 AM</div>
        <q-btn dense flat icon="search" />
        <q-btn dense flat icon="list" />
      </template>
    </q-bar><br />

    <p>Dark Maximized</p>
    <q-bar dark class="q-ml-md my-bar-dark">
      <q-btn dense flat icon="fab fa-apple" />
      <div><strong>My-App</strong></div>
      <div>File</div>
      <div>Edit</div>
      <div>View</div>
      <div>Window</div>
      <div>Help</div>
      <q-space />
      <template v-if="small">
        <q-btn dense flat icon="more_vert" />
      </template>
      <template v-else>
        <q-btn dense flat icon="airplay" />
        <q-btn dense flat icon="battery_charging_full" />
        <q-btn dense flat icon="wifi" />
        <div>Mon 9:41 AM</div>
        <q-btn dense flat icon="search" />
        <q-btn dense flat icon="list" />
      </template>
    </q-bar><br />

    <p>Window</p>
      <q-bar>
        <q-btn dense flat round icon="lens" size="8.5px" color="red" />
        <q-btn dense flat round icon="lens" size="8.5px" color="yellow" />
        <q-btn dense flat round icon="lens" size="8.5px" color="green" />
        <div style="margin: 0 auto;"><strong>My-App</strong></div>
      </q-bar><br />

    <p>Window Dark</p>
      <q-bar dark class="my-bar-dark">
        <q-btn dense flat round icon="lens" size="8.5px" color="red" />
        <q-btn dense flat round icon="lens" size="8.5px" color="yellow" />
        <q-btn dense flat round icon="lens" size="8.5px" color="green" />
        <div style="margin: 0 auto;"><strong>My-App</strong></div>
      </q-bar><br />
  </div>
</template>

<script>
export default {
  data () {
    return {
      small: false
    }
  },
  methods: {
    resize () {
      this.small = this.$refs.wrapper.offsetWidth < 750
    }
  }
}
</script>

<style scoped>
.q-bar {
    white-space: nowrap;
    overflow: hidden;
}
.my-bar-dark {
  background: #313233;
  color: white;
}
.my-bar div:not(.q-btn__content),
.my-bar-dark div:not(.q-btn__content) {
  cursor: pointer;
  padding: 0 8px 0 8px;
}

.my-bar div:hover:not(.q-btn__content) {
  background: #BDBDBD;
}

.my-bar-dark div:hover:not(.q-btn__content) {
  background: #505152 !important;
}
</style>
