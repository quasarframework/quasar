<template>
  <q-btn class="circular small raised" @click="$parent.close()">
    <q-icon :name="icon"></q-icon>
    <slot></slot>
  </q-btn>
</template>

<script>
export default {
  name: 'q-small-fab',
  props: {
    icon: {
      type: String,
      required: true
    }
  }
}
</script>
