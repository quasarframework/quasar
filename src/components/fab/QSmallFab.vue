<template>
  <q-btn round small @click="click" :outline="outline" :push="push" :flat="flat" :color="color">
    <q-icon :name="icon"></q-icon>
    <slot></slot>
  </q-btn>
</template>

<script>
import { QBtn } from '../btn'
import { QIcon } from '../icon'
import FabMixin from './fab-mixin'

export default {
  name: 'q-small-fab',
  mixins: [FabMixin],
  components: {
    QBtn,
    QIcon
  },
  inject: ['__qFabClose'],
  props: {
    icon: {
      type: String,
      required: true
    }
  },
  methods: {
    click (e) {
      this.__qFabClose(() => {
        this.$emit('click', e)
      })
    }
  }
}
</script>
