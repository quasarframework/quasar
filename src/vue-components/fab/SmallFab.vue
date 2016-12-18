<template>
  <button class="circular small raised" @click="$parent.close()">
    <i>{{icon}}</i>
    <slot></slot>
  </button>
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
