<template>
  <div>    
    <q-search class="auto" v-model="filtering.terms" :placeholder="placeholder"></q-search>
    <div v-if="message" class="item">
      <div class="item-content" v-html="message"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['filtering', 'placeholder', 'message']
}
</script>
