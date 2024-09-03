<template>
  <div class="q-layout-padding">
    <div class="flex q-gutter-md" style="margin-bottom: 50px">
      <a class="dev-link rounded-borders q-pa-md cursor-pointer column justify-center bg-white">
        <div class="row no-wrap items-center">
          <q-icon class="order-last q-ml-md" :name="matAddBox" size="3rem" />
          <div class="col">
            <div class="text-uppercase">Title</div>
            <div class="text-weight-bold">Subtitle</div>
          </div>
        </div>
      </a>
      <a class="dev-link rounded-borders q-pa-md cursor-pointer column justify-center bg-white">
        <div class="row no-wrap items-center">
          <q-icon class="order-first q-mr-md" :name="matAddBox" size="3rem" />
          <div class="col">
            <div class="text-uppercase">Some link title</div>
            <div class="text-weight-bold">Some link subtitle</div>
          </div>
        </div>
      </a>
    </div>

    <div class="flex q-gutter-md" style="margin-bottom: 50px">
      <a class="dev-link rounded-borders q-pa-md cursor-pointer column justify-center bg-white">
        <div class="row no-wrap items-center">
          <q-icon class="order-last q-ml-md" name="add_box" size="3rem" />
          <div class="col">
            <div class="text-uppercase">Title</div>
            <div class="text-weight-bold">Subtitle</div>
          </div>
        </div>
      </a>
      <a class="dev-link rounded-borders q-pa-md cursor-pointer column justify-center bg-white">
        <div class="row no-wrap items-center">
          <q-icon class="order-first q-mr-md" name="add_box" size="3rem" />
          <div class="col">
            <div class="text-uppercase">Some link title</div>
            <div class="text-weight-bold">Some link subtitle</div>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import { matAddBox } from '@quasar/extras/material-icons'

export default {
  data () {
    return {
      matAddBox
    }
  }
}
</script>

<style lang="sass">
.dev-link
  position: relative
  &:before
    content: ''
    position: absolute
    top: 0
    right: 0
    bottom: 0
    left: 0
    background: #000
    opacity: 0
    transition: opacity .28s
  &:focus:before
    opacity: .1
</style>
