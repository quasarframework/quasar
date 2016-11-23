<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        <span class="desktop-only">Click</span>
        <span class="mobile-only">Tap</span>
        on each inline FABs below.
        The one that opens on the right also has a backdrop.
      </p>

      <div class="column items-center" style="margin-top: 100px; margin-bottom: 100px;">
        <q-fab classNames="purple" icon="keyboard_arrow_up" direction="up">
          <q-small-fab class="white" @click.native="toast('mail')">mail</q-small-fab>
          <q-small-fab class="white" @click.native="toast('alarm')">alarm</q-small-fab>
        </q-fab>

        <q-fab icon="keyboard_arrow_left" direction="left">
          <q-small-fab class="white" @click.native="toast('mail')">mail</q-small-fab>
          <q-small-fab class="white" @click.native="toast('alarm')">alarm</q-small-fab>
        </q-fab>

        <q-fab classNames="secondary push" icon="keyboard_arrow_right" direction="right">
          <q-small-fab class="primary" @click.native="toast('mail')">mail</q-small-fab>
          <q-small-fab class="white" @click.native="toast('alarm')">alarm</q-small-fab>
        </q-fab>

        <q-fab classNames="tertiary glossy" icon="keyboard_arrow_down" direction="down">
          <q-small-fab class="white" @click.native="toast('mail')">mail</q-small-fab>
          <q-small-fab class="white" @click.native="toast('alarm')">alarm</q-small-fab>
        </q-fab>
      </div>

      <p class="caption" style="margin-bottom: 100px;">
        There's also the absolute positioned one on bottom
        right of screen which maintains position on Page scroll.
        It has a click/tap event injected on itself when expanded.
        You can close it by clicking/tapping on the whitey backdrop.
      </p>

      <q-fab
        class="absolute-bottom-right"
        @click="alert()"
        classNames="primary"
        active-icon="alarm"
        direction="up"
        style="right: 18px; bottom: 18px;"
      >
        <q-small-fab class="purple" @click.native="toast('mail')">mail</q-small-fab>
        <q-small-fab class="secondary" @click.native="toast('alarm')">alarm</q-small-fab>
      </q-fab>
    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from 'quasar'

export default {
  methods: {
    alert () {
      Dialog.create({
        title: 'FAB',
        message: 'Good job! Keep it going.'
      })
    },
    toast (icon) {
      Toast.create({
        icon,
        html: 'So you want your ' + icon + 's, huh?'
      })
    }
  }
}
</script>
