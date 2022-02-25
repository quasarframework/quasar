<template>
  <div class="row q-gutter-sm">
    <q-btn
      push
      color="black"
      style="height: 65px; width: 250px;"
      no-caps
      href="https://donate.quasar.dev"
      target="_blank"
      rel="sponsored"
    >
      <div class="row items-center no-wrap">
        <q-icon left :name="fabGithub" />

        <div class="text-center">
          GitHub Sponsorship
        </div>
      </div>
    </q-btn>

    <form class="inline-block" action="https://www.paypal.me/rstoenescu1" method="post" target="_blank" rel="noopener">
      <q-btn
        push
        color="secondary"
        style="height: 65px; width: 250px;"
        type="submit"
        no-caps
      >
        <div class="row items-center no-wrap">
          <q-icon left :name="fabPaypal" />

          <div class="text-center">
            Paypal<br>(one time)
          </div>
        </div>
      </q-btn>
      <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1" style="background: transparent;">
    </form>
  </div>
</template>

<script>
import {
  fabGithub, fabPaypal
} from '@quasar/extras/fontawesome-v6'

export default {
  name: 'DonatingButtons',

  setup () {
    return {
      fabGithub,
      fabPaypal
    }
  }
}
</script>
