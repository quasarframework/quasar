<template>
  <q-btn class="circular small raised" @click="$parent.close()">
    <q-icon :name="icon"></q-icon>
    <slot></slot>
  </q-btn>
</template>

<script>
import { QBtn } from '../btn'
import { QIcon } from '../icon'

export default {
  name: 'q-small-fab',
  components: {
    QBtn,
    QIcon
  },
  props: {
    icon: {
      type: String,
      required: true
    }
  }
}
</script>
