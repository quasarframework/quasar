<template>
  <q-btn class="circular small raised" @click="$parent.close()">
    <i>{{icon}}</i>
    <slot></slot>
  </q-btn>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true
    }
  }
}
</script>
