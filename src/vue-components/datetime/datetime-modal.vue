<template>
  <div>
    <quasar-inline-datetime :model.sync="model" :type="type" class="no-border" style="width: 100%">
      <div class="modal-buttons row full-width">
        <button @click.native="close()" class="primary clear">{{ cancelLabel }}</button>
        <button @click.native="set(model)" class="primary clear">{{ okLabel }}</button>
      </div>
    </quasar-inline-datetime>
  </div>
</template>

<script>
export default {
  methods: {}
}
</script>
