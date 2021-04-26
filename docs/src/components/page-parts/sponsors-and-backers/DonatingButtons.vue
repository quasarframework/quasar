<template>
  <div class="row q-gutter-sm">
    <q-btn
      push
      color="black"
      style="height: 65px; width: 250px;"
      no-caps
      type="a"
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

    <form class="inline-block" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank" rel="noopener">
      <input type="hidden" name="cmd" value="_s-xclick">
      <input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----
      ">
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
      <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
    </form>
  </div>
</template>

<script>
import {
  fabGithub, fabPaypal
} from '@quasar/extras/fontawesome-v5'

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
