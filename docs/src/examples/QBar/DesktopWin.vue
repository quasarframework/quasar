<template>
  <div class="q-pa-md q-gutter-sm">

    <p>Windows</p>
    <q-bar class="q-ml-md my-bar" >
      <div>File</div>
      <div>Edit</div>
      <div>View</div>
      <div>Window</div>
      <div>Help</div>
      <q-space />
      <q-btn dense flat icon="minimize" />
      <q-btn dense flat icon="crop_square" />
      <q-btn dense flat icon="close" />
    </q-bar><br />

    <p>Dark Windows</p>
    <q-bar dark class="q-ml-md my-bar-dark" >
      <div>File</div>
      <div>Edit</div>
      <div>View</div>
      <div>Window</div>
      <div>Help</div>
      <q-space />
      <q-btn dense flat icon="minimize" />
      <q-btn dense flat icon="crop_square" />
      <q-btn dense flat icon="close" />
    </q-bar><br />
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style>
.my-bar div:not(.q-btn__content),
.my-bar-dark div:not(.q-btn__content) {
  cursor: pointer;
  padding: 0 8px 0 8px;
}

.my-bar div:hover:not(.q-btn__content) {
  background: #BDBDBD;
}

.my-bar-dark div:hover:not(.q-btn__content) {
  background: #E8E8E8;
}
</style>
