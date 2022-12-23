<template>
  <div class="row q-gutter-sm">
    <q-btn
      push
      color="brand-accent"
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
            Paypal (one time)
          </div>
        </div>
      </q-btn>
      <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
    </form>
  </div>
</template>

<script setup>
import { fabGithub, fabPaypal } from '@quasar/extras/fontawesome-v6'
</script>
