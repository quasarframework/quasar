<template>
  <router-link
    :to="to"
    :replace="replace"
    :append="append"
    :exact="exact"
    tag="div"
    class="item item-link drawer-closer"
  >
    <i v-if="icon" class="item-primary">{{icon}}</i>
    <div class="item-content">
      <slot></slot>
    </div>
  </router-link>
</template>

<script>
export default {
  props: ['icon', 'to', 'replace', 'append', 'exact']
}
</script>
