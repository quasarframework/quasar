<template>
  <div style="text-align: center; margin-top: 130px;">
    <quasar-fab icon="keyboard_arrow_left" active-icon="mail" direction="left">
      <quasar-small-fab>mail</quasar-small-fab>
      <quasar-small-fab>alarm</quasar-small-fab>
    </quasar-fab>

    <quasar-fab icon="keyboard_arrow_up" direction="up">
      <quasar-small-fab>mail</quasar-small-fab>
      <quasar-small-fab>alarm</quasar-small-fab>
    </quasar-fab>

    <quasar-fab icon="keyboard_arrow_down" direction="down">
      <quasar-small-fab>mail</quasar-small-fab>
      <quasar-small-fab>alarm</quasar-small-fab>
    </quasar-fab>

    <quasar-fab backdrop type="primary" icon="keyboard_arrow_right" direction="right">
      <quasar-small-fab class="primary">mail</quasar-small-fab>
      <quasar-small-fab>alarm</quasar-small-fab>
    </quasar-fab>
  </div>

  <quasar-fab :click="alert" class="absolute-bottom-right" type="primary" active-icon="alarm" direction="up">
    <quasar-small-fab class="primary">mail</quasar-small-fab>
    <quasar-small-fab>alarm</quasar-small-fab>
  </quasar-fab>
</template>

<script>
import { Dialog } from 'quasar'

export default {
  methods: {
    alert () {
      Dialog.create({
        title: 'FAB',
        message: 'Good job! Keep it going.'
      }).show()
    }
  }
}
