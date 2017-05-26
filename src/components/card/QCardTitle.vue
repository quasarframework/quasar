<template>
  <div class="q-card-primary q-card-container row no-wrap">
    <div class="col column">
      <div class="q-card-title"><slot></slot></div>
      <div class="q-card-subtitle"><slot name="subtitle"></slot></div>
    </div>
    <div class="col-auto self-center q-card-title-extra"><slot name="right"></slot></div>
  </div>
</template>

<script>
export default {
  name: 'q-card-title'
}
</script>
